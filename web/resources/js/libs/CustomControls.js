/**
 * Created by stefanos on 5/5/2015.
 */

OpenLayers.Control.Identify =  OpenLayers.Class(OpenLayers.Control, {
    layer: null,
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function (options, _layer) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    },

    trigger: function (e) {
        var xyz = map.getLonLatFromPixel(e.xy);
        var point = new OpenLayers.Geometry.Point(xyz.lon, xyz.lat);//.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'));

                var olFilter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                    property: GEOMcolumn,
                    value: point,
                    projection: map.getProjection()
                });


                var filterFormat = new OpenLayers.Format.Filter.v1_1_0();
                var xmlFormat = new OpenLayers.Format.XML();

                var ogcFilter = filterFormat.write(olFilter);
                var ogcFilterString = xmlFormat.write(ogcFilter);

                Ext.Ajax.request({
                    url: OpenLayers.ProxyHost + geoserverWfsDefaults.wfsUrl,
                    method: 'POST',
                    params: {
                        filter: ogcFilterString,
                        typeName: selectedLayer[0].params.LAYERS,
                        geomnameplacehoder: GEOMcolumn,
                        version: geoserverWfsDefaults.wfsVersion,
                        request: 'GetFeature',
                        outputFormat: 'json'
                    },
                    success: function (response, options) {
                        var result = Ext.JSON.decode(response.responseText);

                        if (response.responseText !== "") {
                            var geojsonformat = new OpenLayers.Format.GeoJSON(),
                                features = geojsonformat.read(response.responseText),
                                featureCount = features.length,
                                verticeCount = 0;

                            // count the total number of vertices
                            Ext.each(features, function (feat) {
                                verticeCount += feat.geometry.getVertices().length;
                                feat.geometry = feat.geometry.transform(new OpenLayers.Projection('EPSG:2100'), new OpenLayers.Projection('EPSG:900913'))
                                highlight.addFeatures(feat);
                            });

                        }

                        identitems = [];

                        for (var property in result.features[0].properties) {
                            if (result.features[0].properties.hasOwnProperty(property)) {
                                identitems[property] = result.features[0].properties[property];
                            }
                        }

                        var popgrid = Ext.create('Ext.grid.property.Grid', {
                            forceFit: true,
                            nameColumnWidth: 250,
                            source: identitems,
                            listeners: {
                                'beforeedit': {
                                    fn: function () {
                                        return false;
                                    }
                                }
                            }
                        });

                        var point = new OpenLayers.Geometry.Point(xyz.lon, xyz.lat);
                        var attributes = {name: "my name", bar: "foo"};
                        var feature = new OpenLayers.Feature.Vector(point, attributes);

                        createPopup(feature, popgrid);
                    },
                    failure: function (response, options) {
                        var text = response.responseText;
                        // process server response here
                        Ext.log('failure');
                    }
                });
        ident.deactivate();
    }
});


var ident = new OpenLayers.Control.Identify();

function createPopup(feature, popgrid) {
    var win = Ext.WindowManager.getActive();
    if (win) {
        win.close();
    }
    popupOpts = Ext.apply({
        title: LInfo,
        location: feature,
        width:400,
        map:map,
        layout   : 'fit',
        maximizable: true,
        collapsible: true,
        anchorPosition: 'auto',
        items:[popgrid]
    });

    popup = Ext.create('GeoExt.window.Popup', popupOpts);
    popup.on({
        close: function() {
            vector.removeAllFeatures();
        }
    });
    popup.show();
}

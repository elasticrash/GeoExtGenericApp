/**
 * Created by tougo on 15/11/15.
 */
OpenLayers.Control.SelectPolygonFromWms = new OpenLayers.Class(OpenLayers.Control,{
    defaultHandlerOptions: {
    'single': true,
    'double': false,
    'pixelTolerance': 0,
    'stopSingle': false,
    'stopDouble': false
},

    initialize: function(options) {
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

    trigger: function(e) {
        var xyz = map.getLonLatFromPixel(e.xy);
        var point = new OpenLayers.Geometry.Point(xyz.lon, xyz.lat);
        //POPUP GRID

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
            url: OpenLayers.ProxyHost+geoserverWfsDefaults.wfsUrl,
            method: 'POST',
            params: {
                filter: ogcFilterString,
                typeName: Ext.getCmp('editlayerid').getValue(),
                geomnameplacehoder: GEOMcolumn,
                version:geoserverWfsDefaults.wfsVersion,
                request:'GetFeature',
                outputFormat:'json'
            },
            success: function(response, options){
                var text = response.responseText;
                // process server response here
                if (text !== "") {
                    var geojsonformat = new OpenLayers.Format.GeoJSON(),
                        features = geojsonformat.read(text),
                        featureCount = features.length,
                        verticeCount = 0;

                    // count the total number of vertices
                    Ext.each(features, function(feat) {
                        verticeCount += feat.geometry.getVertices().length;
                        feat.geometry = feat.geometry.transform(epsg, epsg900913);
                        feat.pstate = "update";
                        feat.ltype = Ext.getCmp('editlayerid').value;
                        vector.addFeatures(feat);
                        feat.attributes = {
                            ltype : Ext.getCmp("editlayerid").value,
                            pstate : "insert"
                        }
                    });
                }
            },
            failure: function(response, options){
            }
        });
        spfwms.deactivate();
    }});

var spfwms = new OpenLayers.Control.SelectPolygonFromWms();

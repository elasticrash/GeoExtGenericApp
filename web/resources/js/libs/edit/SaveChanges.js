Ext.define('CodenTonic.tools.vector.SaveChangesButton', {
    extend: 'Ext.button.Button',
    xtype: 't_savechangesbutton',
    requires : [
    ],
    tooltip: '',
    msgBoxSaveErrorTitle: '',
    msgBoxSaveErrorText: '',
    invalidGeometriesFoundText: '',
    mapPanel: null,
    map: null,
    targetVectorLayer: null,
    targetWmsLayer: null,
    featureStore: null,
    reloadStoreAfterWfstCommit: true,
    checkGeometriesValidityBeforeSave: true,
    initComponent: function() {
        var me = this;
        me.mapPanel = mapPanel;
        me.map = map;
        me.on('click', me.onClick);
        me.callParent();
    },
    onClick: function(btn, e, eOpts) {
        var me = this,
            allValid = false;

        me.featureStore = featurePanel.grid.getStore();
        me.mapPanel = mapPanel;

        if (Ext.isObject(me.featureStore) && !Ext.isEmpty(me.targetVectorLayer)) {
            var CreateInsertXml = me.insertfeaturesXMLS();
        }
    },
    insertfeaturesXMLS: function()
    {
        var me = this;

        var tableproperties = [];
        for (var property in me.featureStore.data.items[0].data) {
            if (me.featureStore.data.items[0].data.hasOwnProperty(property)) {
                tableproperties.push(property);
            }
        }

        //updatefromfeaturestore
        Ext.each(me.targetVectorLayer.features, function(feat){
            for (var l = 0; l < me.featureStore.data.keys.length; l++) {
                if(feat.id == me.featureStore.data.keys[l]) {
                    for (var property in feat.data) {
                        if (feat.data.hasOwnProperty(property)) {
                            if(tableproperties.indexOf(property) > 1) {
                                feat.data[property] = me.featureStore.data.items[0].data[property];
                            }
                        }
                    }
                }
            }
        });


        var commitment = [];
        commitment.name = 'wfs:Transaction service="WFS" version="1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ELPHO="http://www.elpho.gr" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd"'
        commitment.action = [];

        var i = 0;

        Ext.each(me.targetVectorLayer.features, function(feat) {
            if (feat.geometry !== null) {
                var gmlgeometry = null;

                if (feat.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                    gml = new OpenLayers.Format.GML();
                    gmlgeometry = gml.buildGeometry.polygon.apply(gml, [feat.geometry.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'))])
                }
                if (feat.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                    gml = new OpenLayers.Format.GML();
                    gmlgeometry = gml.buildGeometry.point.apply(gml, [feat.geometry.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'))])
                }
                if (feat.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                    gml = new OpenLayers.Format.GML();
                    gmlgeometry = gml.buildGeometry.linestring.apply(gml, [feat.geometry.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'))])
                }
                if (feat.geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") {
                    gml = new OpenLayers.Format.GML();
                    gmlgeometry = gml.buildGeometry.polygon.apply(gml, [feat.geometry.components[0].transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'))])
                }
                if (feat.geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") {
                    gml = new OpenLayers.Format.GML();
                    gmlgeometry = gml.buildGeometry.point.apply(gml, [feat.geometry.components[0].transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'))])
                }
                if (feat.geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") {
                    gml = new OpenLayers.Format.GML();
                    gmlgeometry = gml.buildGeometry.linestring.apply(gml, [feat.geometry.components[0].transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:2100'))])
                }

                if(gmlgeometry!=null) {
                    var plgGMLString = (new XMLSerializer()).serializeToString(gmlgeometry);

                    commitment.action[i] = [];
                    if (feat.pstate == "insert") {
                        commitment.action[i].name = 'wfs:Insert';
                    }
                    if (feat.pstate == "update") {
                        commitment.action[i].name = 'wfs:Update';
                    }
                    commitment.action[i].table = [];
                    commitment.action[i].table[i] = [];
                    commitment.action[i].table[i].name = geoserverWfsDefaults.nsAlias + feat.ltype;
                    commitment.action[i].table[i].attributes = [];

                    commitment.action[i].table[i].attributes[0] = [];
                    commitment.action[i].table[i].attributes[0].name = GEOMcolumn;
                    commitment.action[i].table[i].attributes[0].data = plgGMLString;
                    var j = 1;
                    for (var property in feat.data) {
                        if (feat.data.hasOwnProperty(property)) {
                            commitment.action[i].table[i].attributes[j] = [];
                            commitment.action[i].table[i].attributes[j].name = property;
                            commitment.action[i].table[i].attributes[j].data = String(feat.data[property]).replace(/&/g, "");
                            j++;
                        }
                    }
                    i++;
                }
            }
        });

        var xmlpost =  "<"+ commitment.name+ ">";
        for(var k = 0; k < commitment.action.length; k++) {
            var act = commitment.action[k];
            if(act.name == "wfs:Insert") {
                xmlpost += "<" + act.name + ">";
                xmlpost += "<" + act.table[k].name + ">";
                for (var l = 0; l < act.table[k].attributes.length; l++) {
                    xmlpost += "<ELPHO:" + act.table[k].attributes[l].name + ">" + act.table[k].attributes[l].data + "</ELPHO:" + act.table[k].attributes[l].name + ">";
                }
                xmlpost += "</" + act.table[k].name + ">";
                xmlpost += "</" + act.name + ">";
            }
            if(act.name == "wfs:Update") {
                xmlpost += "<" + act.name + " " + "typeName='" + act.table[k].name + "' >";
                for (var l = 0; l < act.table[k].attributes.length; l++) {
                    xmlpost += "<wfs:Property>";

                    xmlpost += "<wfs:Name>" + act.table[k].attributes[l].name + "</wfs:Name>";
                    xmlpost += "<wfs:Value>" + act.table[k].attributes[l].data + "</wfs:Value>";

                    xmlpost += "</wfs:Property>";
                }

                xmlpost +="<ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>ID</ogc:PropertyName><ogc:Literal>"+ act.table[k].attributes[1].data +
                "</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>";
                xmlpost += "</" + act.name + ">";
            }

        }
        xmlpost += "</wfs:Transaction>";

        //TO DO need to save credentials in database encrypted
        Ext.Ajax.request({
            url: OpenLayers.ProxyHost+geoserverWfsDefaults.wfsUrl,
            method: 'POST',
            xmlData: xmlpost,
            params: {
                username:'admin',
                password: 'geoserver',
                request: 'Transaction'
            },
            success: function(response, options){
                var text = response.responseText;

                for(var i=0;i<map.layers.length;i++)
                {
                   map.layers[i].redraw(true);
                }

                if(text.indexOf("SUCCESS") > -1);
                {
                    CustomMessage(LResults, "Save Completed");
                }
                me.targetVectorLayer.removeAllFeatures();
            },
            failure: function(response, options){
                var text = response.responseText;
                Ext.log('failure');
            }
        });
    },
    checkGeometriesValidity: function() {

        var me = this,
            parser = new jsts.io.OpenLayersParser(),
            jstsAndOlFeatureArray = [];
        invalidFeatures = [];

        Ext.each(me.targetVectorLayer.features, function(feat) {
            if (feat.geometry !== null && feat.state !== OpenLayers.State.DELETE) {
                var featureObject = {};
                featureObject.olFeature = feat;
                featureObject.jstsGeom = parser.read(feat.geometry);
                jstsAndOlFeatureArray.push(featureObject);
            }
        });
        Ext.each(jstsAndOlFeatureArray, function(featureObject) {
            if (featureObject.jstsGeom.isValid() === false) {
                invalidFeatures.push(featureObject.olFeature);
            }
        });
        return invalidFeatures;
    },

    highlightAndZoomToInvalidFeatures: function(invalidFeatures) {
        var me = this,
            invalidFeaturesExtent;

        Ext.each(invalidFeatures, function(feat) {
            var style = OpenLayers.Util.applyDefaults({
                fillColor: '#e00000',
                fillOpacity: 0.6
            }, feat.style);
            feat.style = style;

            if (invalidFeaturesExtent) {
                invalidFeaturesExtent.extend(feat.geometry.getBounds());
            } else {
                invalidFeaturesExtent = feat.geometry.getBounds();
            }
        });
        me.targetVectorLayer.redraw();
        me.targetVectorLayer.map.zoomToExtent(invalidFeaturesExtent);
    },
    wfstCommitCallback: function(resp) {
        var me = this;

        if(resp.code === 1){
        } else if(resp.code === 0){
            // FAILURE
            me.mapPanel.setLoading(false);
            Ext.Msg.alert(me.msgBoxSaveErrorTitle, me.msgBoxSaveErrorText);
        }
    },
    updateDataExtentCacheAndReloadLayers: function(){
        me.targetWmsLayer.redraw(true);
    }
});

/**
 * Created by stefanos on 5/5/2015.
 */
/**
 * Created by stefanos on 5/5/2015.
 */
Ext.define('Elpho.tools.DownloadParcelButton', {
    extend: 'Ext.button.Button',
    xtype: 't_base_downloadparcelbutton',
    placeholderGeometryColumn: 'GEOM',
    placeHolderDefaultSld: 'DEFAULT',
    filterFormat: null,
    xmlFormat: null,
    lastRequest: null,
    renderConfirmThreshold: 25000,
    updateStatusText: '',
    renderConfirmMsg: '',
    tooltip: 'Δημιουργία Περιοχής Εξαγωγής',
    iconCls: 'icon-upload',
    requires: ['GeoExt.Action'],
    constructor: function() {
        var me = this,
            drawlayer;

        me.filterFormat = new OpenLayers.Format.Filter.v1_1_0();
        me.xmlFormat = new OpenLayers.Format.XML();
        me.callParent(arguments);

        drawlayer = map.getLayersByName('temp. Polygon select Layer')[0];

        if (!drawlayer) {
            drawlayer = new OpenLayers.Layer.Vector('temp. Polygon select Layer', {
                displayInLayerSwitcher: false
            });
            map.addLayer(drawlayer);
        }

        me.control = new OpenLayers.Control.DrawFeature(
            drawlayer,
            OpenLayers.Handler.Polygon,
            {
                eventListeners: {
                    featureadded: me.onFeatureDrawn,
                    scope: me
                }
            }
        );

        var action = Ext.create('GeoExt.Action', {
            control: me.control,
            map: map,
            enableToggle: true,
            toggleGroup: "map-unique-action",
            group: "map-unique-action",
            allowDepress: true,
            pressed: false,
            text: me.text
        });

        me.callParent([action]);

        // deactivate hover-select on toggle
        me.on('toggle', this.deactivateHoverSelectFunctionality);
    },
    cleanDrawLayer: function(){
        this.control.layer.removeAllFeatures();
    },
    deactivateHoverSelectFunctionality: function(button, state) {
        if (state === true) {
            var xtype = 't_hover_select_button',
                hoverSelectTools = Ext.ComponentQuery.query(xtype);
            Ext.each(hoverSelectTools, function(hoverSelectTool) {
                hoverSelectTool.toggle(false);
            });
        }
    },
    onFeatureDrawn: function(evt) {
        var me = this,
            geometry = me.applyBuffering(evt.feature.geometry),
            filter = me.createFilterFromGeometry(geometry);

        if ( me.lastRequest !== null) {
            Ext.Ajax.abort(me.lastRequest);
        }

        this.requestFeatures(filter);
    },
    createFilterFromGeometry: function(geometry){
        var me = this,
            filterType = me.getCurrentFiltertype(),
            olFilter = new OpenLayers.Filter.Spatial({
                type: filterType,
                property: me.placeholderGeometryColumn,
                value: geometry,
                projection: map.getProjection()
            }),
            ogcFilter = me.filterFormat.write(olFilter),
            ogcFilterString = me.xmlFormat.write(ogcFilter);

        return ogcFilterString;
    },
    getCurrentFiltertype: function() {
        var selector = 'combo[name="spatial-comparators"]',
            spatialFilterCb = Ext.ComponentQuery.query(selector)[0],
            filterType = OpenLayers.Filter.Spatial.INTERSECTS;

        if (Ext.isDefined(spatialFilterCb)) {
            filterType = OpenLayers.Filter.Spatial[spatialFilterCb.getValue()];
        }

        return filterType;
    },
    applyBuffering: function(olGeometry){
        var bufferedGeom = olGeometry.clone(),
            selector = 'combo[name="selection-buffer-width"]',
            bufferComboCandidates = Ext.ComponentQuery.query(selector),
            bufferCombo = (bufferComboCandidates[0]) ?
                bufferComboCandidates[0] :
                null,
            bufferValue = (bufferCombo) ? bufferCombo.getValue() : 0,
            parser,
            jstsOrigGeom,
            jstsBufferedGeom;


        if (bufferValue !== 0) {
            parser = new jsts.io.OpenLayersParser();
            jstsOrigGeom = parser.read(bufferedGeom);
            jstsBufferedGeom = jstsOrigGeom.buffer(bufferValue);
            bufferedGeom = parser.write(jstsBufferedGeom);
        }

        return bufferedGeom;

    },
    requestFeatures: function(filter) {
        var me = this,
            queryLayersAndSlds = me.getQueryLayersAndSlds(),
            queryLayers = queryLayersAndSlds.queryLayers,
            slds = queryLayersAndSlds.slds,
            mapProjection = map.getProjection();

        if (queryLayers.length > 0 ) {
            // add loading mask to map panel while drawing
            mapPanel.setLoading(true);

            if (me.lastRequest !== null) {
                Ext.Ajax.abort(me.lastRequest);
            }

            me.lastRequest = Ext.Ajax.request({
                url: OpenLayers.ProxyHost+geoserverWfsDefaults.wfsUrl,
                method: 'POST',
                params: {
                    filter: filter,
                    typeName: 'ELPHO:SMU_MV_DESC',
                    geomnameplacehoder: me.placeholderGeometryColumn,
                    version:geoserverWfsDefaults.wfsVersion,
                    request:'GetFeature',
                    outputFormat:'json'
                    //slds: slds,
                },
                callback: function(){
                    me.lastRequest = null;
                    me.cleanDrawLayer();
                    mapPanel.setLoading(false);

                    // deactivate after selecting
                    me.toggle(false);
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
                            feat.geometry = feat.geometry.transform(new OpenLayers.Projection('EPSG:2100'), new OpenLayers.Projection('EPSG:900913'))
                        });

                        var renderCallback = function(decision) {
                            if(decision === 'yes'){
                                me.cleanupAndRenderFeatures(features);
                            } else if(decision === 'no'){
                                // not doing anything
                            }
                        };

                        var result = Ext.JSON.decode(text);
                        var msg = "";

                        var titleA = false;
                        var titleB = false;
                        var titleC = false;

                        if(result.features.length > 0) {
                            msg+="Έχετε Επιλέξει " + result.features.length + " ΧΕΜ";
                            CustomMessage("Απάντηση", msg)

                            var myForm = Ext.create('widget.window', {
                                title: "Αποθήκευση Περιοχης Εξαγωγής",
                                closable: true,
                                autosize: true,
                                autoScroll: false,
                                maximizable: false,
                                resizable: false,
                                items: [
                                    {
                                        xtype: 'textareafield',
                                        grow: true,
                                        width: 250,
                                        id: 'dec_id',
                                        fieldLabel: "Περιγραφή"
                                    },
                                    {
                                        xtype: 'button',
                                        text: "Αποθήκευση",
                                        iconCls: 'icon-save',
                                        margin: 5,
                                        handler: function () {
                                            Ext.Ajax.request({
                                                url: 'rest/addControlArea',
                                                method: 'POST',
                                                jsonData: {
                                                    filter: filter,
                                                    request: geoserverWfsDefaults.wfsUrl+"typeName=ELPHO:SMU_MV_DESC&geomnameplacehoder=GEOM&version="+geoserverWfsDefaults.wfsVersion+"&request=GetFeature&outputFormat=shape-zip&filter=" +encodeURIComponent(filter)+"&format_options=charset:ISO8859-7",
                                                    description: Ext.getCmp('dec_id').getValue()
                                                },
                                                success: function(response, options) {
                                                    CustomMessage("Απάντηση", "H Περιοχή Αποθηκεύτηκε με επιτυχία")
                                                },
                                                failure: function(response, options) {
                                                }
                                            });
                                        }
                                    }
                                ]
                            });
                            myForm.show();
                            myForm.on('close', function () {
                                myForm.destroy();
                                myForm = null;
                            });
                        }
                        else
                        {
                            CustomMessage("Στοιχεία Περιοχής", "Η Επιλεγμένη Περιοχή δεν διαθέτει αρχικά αγροτεμάχια");
                        }
                    }
                },
                failure: function(response, options){
                    var text = response.responseText;
                    // process server response here
                    Ext.log('failure');
                }
            });
        }

    },
    cleanupAndRenderFeatures: function(features){
        var me = this,
        // selComp = Ext.ComponentQuery.query('t_hover_select_button')[0],
            targetLayer = getSelectionVectorLayer(),
            activeSelLayer,
            layerName;

        //selComp.cleanupAll();
        vector.removeAllFeatures();

        if(!Ext.isEmpty(features)){
            // get params.layer value, i.e. something like
            // GDAWasser:MYSUPERLAYER
            activeSelLayer = getSelectionLayerFromFeature(features[0]);
            // translate to display name of the layer
            layerName = getLayerNameByLayerParam(activeSelLayer);
            // adjust the active selection layer
            setActiveLayerForSelection(activeSelLayer);
            // raise the selection layer on top
            map.raiseLayer(targetLayer, map.layers.length-1);
            // add the given features as selection
            targetLayer.addFeatures(features);
            // fire event so that contextmenu controller can toggle disabled
            // status of "show selected features"
            me.onGeometrySelected(activeSelLayer, targetLayer);
        }
    },
    onGeometrySelected: function(featuregml, selectionVectorLayer) {
        var targetLayer,
            targetLayerName,
            visibleLayers = map.getLayersBy('visibility', true);

        if (!featuregml) {
            targetLayerName = false;
        } else if (!featuregml.featureNSPrefix && featuregml.featureType) {
            targetLayerName = featuregml.featureType;
        } else if (featuregml.featureNSPrefix && featuregml.featureType) {
            targetLayerName = featuregml.featureNSPrefix + ":" + featuregml.featureType;
        } else {
            targetLayerName = geoserverWfsDefaults.nsAlias + ":" + featuregml;
        }

        if (targetLayerName) {
            Ext.each(visibleLayers, function(layer) {
                if (layer.params && layer.params.LAYERS && layer.params.LAYERS === targetLayerName) {
                    targetLayer = layer;
                }
            });

            this.lastSelectionDescription = {
                selectionVectorLayer: selectionVectorLayer,
                targetLayer: targetLayer
            };
        }

    },
    getQueryLayersAndSlds: function(){
        var me = this,
            placeHolderDefaultSld = me.placeHolderDefaultSld,
            userActiveLayer = map.getLayersBy('gdaIsSelectionLayer', true)[0],
            queryLayers = [],
            slds = [],
            curLayers,
            curSld;

        if (Ext.isDefined(userActiveLayer)) {
            curLayers = userActiveLayer.params.LAYERS;
            curSld = userActiveLayer.params.SLD || placeHolderDefaultSld;

            queryLayers.push(curLayers);
            slds.push(curSld);
        } else {
            Ext.each(map.layers, function(layer){
                if (layer instanceof OpenLayers.Layer.WMS &&
                        // visibility
                    layer.getVisibility() === true &&
                    layer.calculateInRange() === true){

                    curLayers = layer.params.LAYERS;
                    curSld = layer.params.SLD || placeHolderDefaultSld;

                    queryLayers.push(curLayers);
                    slds.push(curSld);
                }
            });

            queryLayers.reverse();
            slds.reverse();
        }

        return {
            queryLayers: queryLayers,
            slds: slds
        };
    },
    getSelectionLayerFromFeature: function(feature) {
        var fid = feature.fid,
            layername = null;

        if (fid && fid.length > 0) {
            var lIdxPoint = fid.lastIndexOf('.');
            layername = fid.substring(0, lIdxPoint);
        }

        return layername;
    },
    confirm: function(msg, userConf) {
        Ext.Msg.show({
            title: me.msgBoxTitlePrompt,
            msg: msg,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION
        });
    }
});
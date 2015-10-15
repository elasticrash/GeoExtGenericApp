/**
 * Created by stefanos on 8/10/2015.
 */
//GENERIC
var Search="Search";
var None = "Select";
var To = "From";
//ANAZHTHSH ME SYNTETAGMENH
var CoordinateSearch= "Go to Coordinate";

Ext.define('AuadminList', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'ifcid', type:'int'},
        {name:'name', type:'string'},
        {name: 'upperLevelUnit', type:'int'},
    ]
});

var selectedlayerfields = Ext.create('Ext.data.Store', {
    fields: ['value', 'name', 'type'],
    data : table
});

var operstore = Ext.create('Ext.data.Store', {
    fields: ['value', 'name'],
    data : operators
});

Ext.define('LutModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'lutid', type:'int'},
        {name:'description', type:'string'},
        {name: 'code', type:'string'},
        {name: 'luttableid', type:'string'},
    ]
});

//PARCEL GRID
Ext.define('ParcelList', {
    extend: 'Ext.data.Model',
    fields: ['parcelId','geom'],
    hasMany:[{model:'ParcelNatnit',name:'parcelNatnit'}]
});

//OPERATOR STORE
Ext.define('LookupModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'code', type:'string'},
        {name:'description', type:'string'}
    ]
});


var search_panel = [
    //ANAZHTHSH ME SYNTETAGMENI
    {
        xtype: 'fieldset',
        title: CoordinateSearch,
        autoHeight: true,
        anchor: '80%',
        margin: 10,
        items: [{
            xtype: 'textfield',
            anchor: '95%',
            id: 'x_id',
            width: 220,
            fieldLabel: "X"
        }, {
            xtype: 'textfield',
            anchor: '95%',
            id: 'y_id',
            width: 220,
            fieldLabel: "Y"
        },
            {
                xtype: 'button',
                text: Search,
                margin: 10,
                handler: function () {
                    GotoCoordinates();
                }
            }
        ]
    },
    {
        xtype: 'fieldset',
        title: "Search Layer",
        autoHeight: true,
        anchor: '80%',
        margin: 10,
        items: [
            {
                xtype: 'combo',
                anchor: '95%',
                id: 'layerfield_id',
                fieldLabel: "Layer Field",
                emptyText: None,
                width: 220,
                store: selectedlayerfields,
                displayField: 'name',
                valueField: 'value',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: false,
                mode: 'local',
                editable: false,
                listeners: {
                    'select': function (cmb, rec, idx) {
                        if(rec[0].data.type=='xsd:decimal')
                        {
                            operators.length = 0;
                            operators[0] ={"value":1, "name":">"};
                            operators[1] ={"value":2, "name":"<"};
                            operators[2] ={"value":3, "name":"="};

                            operstore.load();
                        }
                        else
                        {
                            operators.length = 0;
                            operators[0] ={"value":4, "name":"like"};

                            operstore.load();
                        }
                    }}
            },
            {
                xtype: 'combo',
                anchor: '95%',
                id: 'operator_id',
                fieldLabel: "Operator",
                emptyText: None,
                width: 220,
                store: operstore,
                displayField: 'name',
                valueField: 'value',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: false,
                mode: 'local',
                editable: false
            },
            {
                xtype: 'textfield',
                anchor: '95%',
                id: 'perc_id',
                width: 220,
                fieldLabel: 'text'
            },
            {
                xtype: 'button',
                text: Search,
                margin: 10,
                cleanupAndRenderFeatures: function(features){
                    var me = this,
                        targetLayer = vector,
                        activeSelLayer,
                        layerName;

                    vector.removeAllFeatures();

                    if(!Ext.isEmpty(features)){
                        activeSelLayer = selectedLayer[0].params.LAYERS;
                        layerName = getLayerNameByLayerParam(activeSelLayer);
                        setActiveLayerForSelection(activeSelLayer);
                        map.raiseLayer(targetLayer, map.layers.length-1);
                        targetLayer.addFeatures(features);
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
                getCurrentFiltertype: function() {
                    filterType = OpenLayers.Filter.Spatial.INTERSECTS;
                    return filterType;
                },
                createFilterFromGeometry: function(geometry){
                    var me = this;
                    me.filterFormat = new OpenLayers.Format.Filter.v1_1_0();
                    me.xmlFormat = new OpenLayers.Format.XML();

                    var filterType = me.getCurrentFiltertype();

                    var logicaloperator = null;
                    if(Ext.getCmp('operator_id').getValue() == 1){
                        logicaloperator = OpenLayers.Filter.Comparison.GREATER_THAN
                    }
                    if(Ext.getCmp('operator_id').getValue() == 2){
                        logicaloperator = OpenLayers.Filter.Comparison.LESS_THAN
                    }
                    if(Ext.getCmp('operator_id').getValue() == 3){
                        logicaloperator = OpenLayers.Filter.Comparison.EQUAL_TO
                    }
                    if(Ext.getCmp('operator_id').getValue() == 4){
                        logicaloperator = OpenLayers.Filter.Comparison.LIKE
                    }
                    olFilter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: [
                            new OpenLayers.Filter.Spatial({
                                type: filterType,
                                property: GEOMcolumn,
                                value: geometry,
                                projection: map.getProjection()
                            }),
                            new OpenLayers.Filter.Comparison({
                                type: logicaloperator,
                                property: Ext.getCmp('layerfield_id').rawValue,
                                value: Ext.getCmp('perc_id').getValue()
                            })
                        ]
                    });


                    var ogcFilter = me.filterFormat.write(olFilter),
                        ogcFilterString = me.xmlFormat.write(ogcFilter);

                    return ogcFilterString;
                },
                handler: function () {
                    if(Ext.getCmp('layerfield_id').getValue()==null || Ext.getCmp('operator_id').getValue() == null || Ext.getCmp('perc_id').getValue() == null)
                    {
                        Ext.Msg.alert('info', 'The query is not valid. Please check if all fields have a value');
                    }

                    var filter = this.createFilterFromGeometry(map.getExtent())
                    var me = this;

                    vector.removeAllFeatures();

                    me.lastRequest = Ext.Ajax.request({
                        url: OpenLayers.ProxyHost+geoserverWfsDefaults.wfsUrl,
                        method: 'POST',
                        params: {
                            filter: filter,
                            typeName: selectedLayer[0].params.LAYERS,
                            geomnameplacehoder: GEOMcolumn,
                            version:geoserverWfsDefaults.wfsVersion,
                            request:'GetFeature',
                            outputFormat:'json'
                        },
                        callback: function(){
                            me.lastRequest = null;
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

                                if(featureCount == 0)
                                {
                                    Ext.Msg.alert('info', 'There are no results in this area');
                                }

                                // count the total number of vertices
                                Ext.each(features, function(feat) {
                                    verticeCount += feat.geometry.getVertices().length;
                                    feat.geometry = feat.geometry.transform(new OpenLayers.Projection(geoserverWmsDefaults.wmsSrsName), new OpenLayers.Projection('EPSG:900913'))
                                });

                                var renderCallback = function(decision) {
                                    if(decision === 'yes'){
                                        me.cleanupAndRenderFeatures(features);
                                    } else if(decision === 'no'){
                                        // not doing anything
                                    }
                                };

                                // check if we exceed the threshold for rendering
                                if(verticeCount >= me.renderConfirmThreshold){
                                    // let the user decide
                                    me.confirm(
                                        Ext.String.format(
                                            me.renderConfirmMsg,
                                            featureCount,
                                            verticeCount
                                        ),
                                        {fn: renderCallback}
                                    );
                                } else {
                                    // render immediately
                                    me.cleanupAndRenderFeatures(features);
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
            }
        ]
    },
//YPOMNIMA
    {
        xtype: 'fieldset',
        title: "Legend",
        autoHeight: true,
        anchor: '80%',
        margin: 10,
        items: [
            {
                xtype:'image',
                title: "Legend",
                id: 'legend_image'
            }
        ]
    }];

var itemtab = Ext.create('Ext.tab.Panel', {
    layout:'fit',
    height: '100%',
    activeTab: 0,
    border: false,
    autoHeight: true,
    items: [
        {
            title: 'Search Panel',
            items:search_panel
        }
    ]
});

var east_search_panel = Ext.create('Ext.panel.Panel', {
    region: 'east',
    width: 480,
    collapsible: true,
    items: itemtab,
    layout:'fit',
    autoScroll: true
});

function GotoCoordinates()
{
    var x=Ext.getCmp('x_id').getValue();
    var y=Ext.getCmp('y_id').getValue();

    var lt =new OpenLayers.LonLat(x, y,2).transform(epsg, new OpenLayers.Projection('EPSG:900913'));
    map.setCenter(lt,18);
}

function deepCloneStore (source) {
    var target = Ext.create ('Ext.data.Store', {
        model: source.model
    });

    Ext.each (source.getRange (), function (record) {
        var newRecordData = Ext.clone (record.copy().data);
        var model = new source.model (newRecordData, newRecordData.id);

        target.add (model);
    });

    return target;
}
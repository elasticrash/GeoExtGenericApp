/**
 * Created by stefanos on 5/11/2015.
 */
Ext.application({
    name: 'gext2app',
    launch: function() {

        OpenLayers.ProxyHost = "cgi-bin/proxy.cgi?url=";

        map = new OpenLayers.Map("map", {
            projection: epsg900913,
            displayProjection: epsg,
            controls:[
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.ScaleLine(),
                new OpenLayers.Control.MousePosition]
        });


        var layer = new OpenLayers.Layer.OSM("OpenLayers");

        //VECTOR LAYER
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

        var vector_layer_style = new OpenLayers.StyleMap(new OpenLayers.Style({
                strokeColor: "#076600",
                strokeOpacity: 1,
                strokeWidth: 3,
                fillColor: "#F15560",
                fillOpacity: 0.5,
                graphicZIndex: 1,
                label: '${val}',
            },{ context: {
                val: function (feature) {
                    if (feature.geometry && feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                        return feature.ltype;
                    } else {
                        return 'X';
                    }
                }
            }}
        ));

        var selection_layer_style = new OpenLayers.StyleMap({'default':{
            strokeColor: "#FFFF00",
            strokeOpacity: 1,
            strokeWidth: 3,
            fillColor: "#FF5500",
            fillOpacity: 0.5
        }});

        vector = new OpenLayers.Layer.Vector("Result Layer", {
            styleMap: vector_layer_style,
            renderers: renderer,
            projection: epsg
        });

        highlight = new OpenLayers.Layer.Vector("Select Layer", {
            styleMap: selection_layer_style,
            renderers: renderer,
            projection: epsg
        });


        //WMS CAPABILITIES
        wmscapstore = Ext.create('GeoExt.data.WmsCapabilitiesLayerStore', {
            storeId: 'wmscapsStore',
            method: 'POST',
            url: OpenLayers.ProxyHost+encodeURIComponent(geoserverWmsDefaults.wmsUrl +"request=getCapabilities"),
            autoLoad: true
        });

        function onItemCheck(item, checked) {
            var visibility = 0;
            var treeNode = tree.getRootNode();
            if (checked == false) {
                for (var j = 0; j < treeNode.childNodes[0].childNodes.length; j++) {
                    if (item.fieldLabel == treeNode.getChildAt(0).getChildAt(j).data.text) {
                        map.removeLayer(getLayerbyName(item.fieldLabel));
                        treeNode.getChildAt(0).getChildAt(j).remove(true);
                    }
                }
            }
            if (checked == true) {
                map.addLayer(item.llmap);
                treeNode.getChildAt(0).appendChild({
                    text: item.fieldLabel,
                    layer: item.llmap,
                    leaf: true,
                    checked: false,
                    children: [],
                    nodeType: "gx_overlaylayercontainer"
                });
                visibility = 1;
            }
            Ext.Ajax.request({
                url: "rest/updatelayer",
                method: 'POST',
                jsonData: {
                    Name: item.fieldLabel,
                    Ns: "ELPHO",
                    Address: item.llmap.url,
                    Srs: geoserverWmsDefaults.wmsSrsName,
                    Visible: visibility,
                    Userid: getCookie()
                },
                success: function (response, options) {
                },
                failure: function (response, options) {
                }
            });
        }
        // Dynamically add layers
        wmscapstore.load({
            callback: function (records, operation, success) {
                var index =0;
                for (var i = 0; i < wmscapstore.data.keys.length; i++) {
                    for (var j = 0; j < wmscapstore.data.items[i].data.styles.length; j++) {

                        //CHECK WHETHER THERE IS A NEED TO REWRITE LAYERS TO POSTGRES DB
                        var layerName = wmscapstore.data.items[i].data.title + " (" + wmscapstore.data.items[i].data.styles[j].name + ")";
                        var layerUrl = geoserverWmsDefaults.wmsUrl;

                        Ext.Ajax.request({
                            url: "rest/IdExists",
                            method: 'POST',
                            jsonData: {
                                Name: layerName,
                                Ns: geoserverWmsDefaults.nsAlias,
                                Address: layerUrl,
                                Srs: geoserverWmsDefaults.wmsSrsName,
                                Visible: 1,
                                Userid: getCookie()
                            },
                            success: function (response, options) {
                                var result = Ext.JSON.decode(response.responseText);
                                index++;
                                if(result.Visible == 1) {
                                    var wmscaplayer = getwmsCapLayerbyName(result.name, wmscapstore);

                                    var opmap = createOpenLayersLayer(result.name, wmscaplayer[0].name,wmscaplayer[0].styles[wmscaplayer[1]].name)
                                    map.addLayer(opmap);


                                    var treeNode = tree.getRootNode();
                                    treeNode.getChildAt(0).appendChild({
                                        text: opmap.name,
                                        layer: opmap,
                                        leaf: true,
                                        checked: false,
                                        children: [],
                                        nodeType: "gx_overlaylayercontainer"
                                    });
                                }


                                if(result.ElementCount == 0) {
                                    Ext.Ajax.request({
                                        url: "rest/addlayer",
                                        method: 'POST',
                                        jsonData: {
                                            Name: result.name,
                                            Ns: result.Ns,
                                            Address: result.Address,
                                            Srs: result.Srs,
                                            Visible: result.Visible,
                                            Userid: result.Userid
                                        },
                                        success: function (response, options) {
                                        },
                                        failure: function (response, options) {
                                        }
                                    });
                                }
                                else
                                {
                                    var visibility = true;
                                    if(result.Visible == 0) {
                                        visibility = false;
                                    }

                                    var wmscaplayer = getwmsCapLayerbyName(result.name, wmscapstore);
                                    var cmap = createOpenLayersLayer(result.name, wmscaplayer[0].name, wmscaplayer[0].styles[wmscaplayer[1]].name);

                                    layers.push({
                                        xtype: 'checkboxfield',
                                        labelWidth: 200,
                                        id: "id" + cmap.id,
                                        fieldLabel: result.name,
                                        checked: visibility,
                                        inputValue: index,
                                        handler: onItemCheck,
                                        llmap: cmap
                                    });
                                }
                            },
                            failure: function (response, options) {
                            }
                        });

                    }
                }
                map.addLayer(vector);
                map.addLayer(highlight);
            }
        });

        //add predifined local layers
        map.addLayer(layer);


        //MEASUREMENTS
        var measurearea = CodenTonic.tools.MeasureAreaButton;
        var measureline = CodenTonic.tools.MeasureLineButton;

        //zoom in action
        var zoomin_action = new GeoExt.Action({
            control: new OpenLayers.Control.ZoomBox,
            map: map,
            iconCls: 'icon-zoom-area',
            scale: 'medium',
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: LZoomAreaIn,
            group: "tools"
        });

        //pan action
        var nagivate_action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.Navigation(),
            map: map,
            iconCls: 'icon-pan',
            scale: 'medium',
            toggleGroup: "tools",
            allowDepress: false,
            pressed: true,
            tooltip: LNavigate,
            group: "tools",
            checked: true
        });

        var zoomBox = Ext.create('Ext.button.Button', zoomin_action);
        var navigate = Ext.create('Ext.button.Button', nagivate_action);

        var resetSelections = Ext.create('Ext.button.Button', {
            tooltip:  LClearResults,
            iconCls: 'icon-reset',
            scale: 'medium',
            handler: function() {
                highlight.removeAllFeatures();
                vector.removeAllFeatures();
            }
        });

        var printbutton =
        {
            xtype: 'button',
            tooltip: LPrint,
            iconCls: 'icon-print',
            scale: 'medium',
            margin: 5,
            handler: function () {
                var print = Ext.create(CodenTonic.widgets.MapPrintWindow);

            }
        };

        var IdentifyButton = Ext.create('Ext.button.Button',{
            iconCls: 'icon-info',
            tooltip: LIdentify,
            scale: 'medium',
            handler: function() {
                ident.activate();
            }
        });

        var selectArea = CodenTonic.tools.SaveFeatureArea;

        var ctrl = new OpenLayers.Control.NavigationHistory();
        map.addControl(ctrl);

        var paction = Ext.create('GeoExt.Action', {
            iconCls: 'icon-previous',
            control: ctrl.previous,
            scale: 'medium',
            disabled: true,
            tooltip: LPreviousExtent
        });

        var previous = Ext.create('Ext.button.Button', paction);

        var naction = Ext.create('GeoExt.Action', {
            iconCls: 'icon-next',
            control: ctrl.next,
            scale: 'medium',
            disabled: true,
            tooltip: LNextExtent
        });

        var next = Ext.create('Ext.button.Button', naction);

        var downloadArea = Ext.create('Ext.button.Button', {
            tooltip: LDownloadArea,
            iconCls: 'icon-download',
            scale: 'medium',
            handler: function() {

                Ext.define('DList', {
                    extend: 'Ext.data.Model',
                    fields: [
                        {name: 'id', type: 'int'},
                        {name: 'filter', type: 'string'},
                        {name: 'request', type: 'string'},
                        {name: 'description', type: 'string'}
                    ]
                });

                var Grid1Store = Ext.create('Ext.data.Store', {
                    model: 'DList',
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'rest/getControlAreas',
                        method: "GET",
                        reader: {
                            type: 'json',
                            root: ''
                        }
                    }
                });

                pgrid = Ext.create('Ext.grid.GridPanel', {
                    title: LTableOfExportedAreas,
                    store: Grid1Store,
                    forcefit: true,
                    columns: [
                        {text: 'Description', dataIndex: 'description'},
                        {id: 'wmsindex',text: "Select Area", width: 250,renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                            var id = Ext.id();
                            var cid = Ext.id();
                            Ext.defer(function() {
                                Ext.create('Ext.form.ComboBox', {
                                    renderTo: id,
                                    id:cid,
                                    width: 150,
                                    store: wmscapstore,
                                    queryMode: 'local',
                                    displayField: 'name'
                                });
                            }, 50);

                            record.comboid = cid;

                            return Ext.String.format('<div id="{0}"></div>', id);
                        }},
                        {
                            text: LDownloadArea,
                            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                                var id = Ext.id();
                                Ext.defer(function () {
                                    Ext.widget('button', {
                                        renderTo: id,
                                        iconCls: 'icon-save',
                                        handler: function () {
                                            var selectedRecord = pgrid.getSelectionModel().getSelection()[0];
                                            var vlvalue = Ext.getCmp(selectedRecord.comboid).getValue();
                                            var requested_features = record.data.request.replace("LAYERCHOICEPLACEHOLDER", vlvalue);
                                            window.open(requested_features);
                                        }
                                    });
                                }, 80);
                                return Ext.String.format('<div id="{0}"></div>', id);
                            }, width:200
                        }
                    ]
                });

                var mform = Ext.create('widget.window', {
                    height: 300,
                    width: 600,
                    layout   : 'fit',
                    title: LDownloadArea,
                    closable: true,
                    maximizable: false,
                    resizable: false,
                    items: [pgrid]
                });
                mform.show();
                mform.on('close', function () {
                    mform.destroy();
                    mform = null;
                });
            }
        });

        var options = Ext.create('Ext.button.Button', {
            tooltip: LOptions,
            iconCls: 'icon-options',
            scale: 'medium',
            handler: function() {
                OpenOptionForm(tree, layers);
            }
        });

        var login = Ext.create('Ext.button.Button', {
            tooltip: LLogin,
            iconCls: 'icon-login',
            scale: 'medium',
            handler: function() {
                OpenLoginForm();
            }
        });

        //edit tools
        var drawfeature = Ext.create('CodenTonic.tools.vector.DrawButton', {
            targetVectorLayer: vector,
            id: 'edittoolid',
            iconCls: 'icon-edit',
            scale: 'medium',
            tooltip: "New Feature",
            handler: OpenLayers.Handler.Polygon,
            ltype: "bio",
            handlerOpts: {
                style: OpenLayers.Feature.Vector.style['default'],
                multi: OpenLayers.Handler.Polygon
            }
        });

        var extractfeature = Ext.create('Ext.button.Button',{
            iconCls: 'icon-feature-raster',
            scale: 'medium',
            tooltip: "Extract Feature",
            handler: function() {
                spfwms.activate();
            }
        });

        var selectFeatureButton = Ext.create('CodenTonic.tools.vector.SelectFeatureButton', {
            targetVectorLayer: vector,
            iconCls: 'icon-pointer',
            scale: 'medium',
            listeners: {
                scope: this,
                'toggle': function(button, pressed, eOpts) {
                    if(pressed === false){
                        mapPanel.query('.button').forEach(function(c){c.setDisabled(false);});
                    }
                }
            }
        });

        var layercombo = Ext.create('Ext.form.ComboBox', {
            id: "editlayerid",
            fieldLabel: 'Choose Edit Layer',
            store: wmscapstore,
            displayField: 'name',
            valueField: 'prefix'
        });

        layercombo.on('select', function() {
            if(Ext.getCmp('edittoolid').control.active) {
                Ext.get('edittoolid').dom.click();
            }
        });

        var saveButton = {
            xtype: 't_savechangesbutton',
            tooltip: LSave,
            iconCls: 'icon-save',
            scale: 'medium',
            targetVectorLayer: vector
        };

        var simplifyButton = {
            xtype: 't_simplifypolygonbutton',
            tooltip: LSave,
            iconCls: 'icon-simplify-polygon',
            scale: 'medium',
            targetVectorLayer: vector
        };

        //MAP PANEL
        mapPanel = Ext.create('GeoExt.panel.Map', {
            border: true,
            region: "center",
            map: map,
            center: [2639241, 4591171],
            zoom: 7
        });

        //TREE
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                text: "Root",
                expanded: true,
                children: [
                    {
                        text: "Dynamic Layers",
                        leaf: false,
                        expanded: true,
                        children: []
                    },
                    {
                        plugins: [{
                            ptype: 'gx_baselayercontainer',
                            loader: {store: mapPanel.layers}
                        }],
                        expanded: true,
                        text: 'BaseLayers'
                    }
                ]
            }
        });

        var tree = Ext.create('GeoExt.tree.Panel', {
                border: true,
                region: "west",
                title: LLayers,
                width: 290,
                split: true,
                collapsible: true,
                collapseMode: "mini",
                autoScroll: true,
                store: store,
                rootVisible: false,
                lines: false,
                listeners: {
                    checkchange: {
                        fn: function (record, checked, opts) {
                            record.data.layer.setVisibility(checked)
                        }
                    }
                }
            }
        );
        //tree item click event. gets the layer legend and the layer's geometry column name
        tree.on('itemclick', function(view, record, item, index, event) {
            selectedLayer = [record.data.layer];
            if(selectedLayer[0].params.STYLES!="") {
                Ext.get(legend_image).dom.src = CreateWMSUrl("GetLegendGraphic",null,selectedLayer[0].params.STYLES);
            }
            getAttributesForQuery(selectedLayer[0].params.LAYERS);
        })

        //identify tool, located in the CustomControl.js file
        map.addControl(ident);
        //select feature from wms, located in SelectPolygonFromWms
        map.addControl(spfwms);

        var toolbaritems = [];

        if(toolcategories.maintools) {
            toolbaritems.push(zoomBox);
            toolbaritems.push(navigate);
            toolbaritems.push(previous);
            toolbaritems.push(next);
        }
        if(toolcategories.measuretools) {
            toolbaritems.push({xtype: 'tbseparator'});
            toolbaritems.push(measurearea);
            toolbaritems.push(measureline);
        }
        if(toolcategories.identifytool) {
            toolbaritems.push({xtype: 'tbseparator'});
            toolbaritems.push(IdentifyButton);
        }
        if(toolcategories.printtools) {
            toolbaritems.push({xtype: 'tbseparator'});
            toolbaritems.push(printbutton);
        }
        if(toolcategories.resetselectiontool) {
            toolbaritems.push({xtype: 'tbseparator'});
            toolbaritems.push(resetSelections);
        }
        if(toolcategories.saveareatools) {
            toolbaritems.push({xtype: 'tbseparator'});
            toolbaritems.push(selectArea);
            toolbaritems.push(downloadArea);
        }
        if(toolcategories.edittools)
        {
            toolbaritems.push({xtype: 'tbseparator'});
            toolbaritems.push(drawfeature);
            toolbaritems.push(extractfeature);
            toolbaritems.push(selectFeatureButton);
            toolbaritems.push(layercombo);
            toolbaritems.push(saveButton);
            toolbaritems.push(simplifyButton);
        }
        toolbaritems.push("->");
        toolbaritems.push(options);
        toolbaritems.push(login);

        var toppanel =  Ext.create('Ext.panel.Panel', {
            border: true,
            region: "north",
            height: 40,
            tbar: toolbaritems
        });
        var bottompanel =  Ext.create('Ext.panel.Panel', {
            border: true,
            region: "south",
            height: 30,
            tbar: []
        });
        //create viewport
        Ext.create('Ext.Viewport', {
            layout: "fit",
            hideBorders: true,
            items: {
                layout: "border",
                deferredRender: false,
                items: [toppanel,bottompanel,mapPanel, tree, east_search_panel]
            }
        });

        map.addControl(infoControls);
        selectCtrl.activate();
    }
});
<html>
<head>
<meta charset="utf-8">
<title>GeoExt 2 Generic GIS WEB APP</title>

    <script async=false defer=false src="../resources/js/libs/languages/language-selector.js"></script>
    <link href="http://cdn.sencha.io/ext/gpl/4.2.1/resources/css/ext-all-gray.css" rel="stylesheet" />
    <script src="http://cdn.sencha.com/ext/gpl/4.2.1/ext-all.js"></script>
    <link rel="stylesheet" type="text/css" href="../resources/css/example.css"/>
    <link href="../resources/css/icon.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/OpenLayers.js"></script>
    <script src="../resources/js/thirdParty/proj4js-combined.js"></script>
    <script src="../resources/js/libs/Config.js"></script>

    <script>
    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            GeoExt: "resources/js/thirdParty/geoext2/src/GeoExt",
            Ext: "http://cdn.sencha.com/ext/gpl/4.2.1/src"
        }
    });
//Global Variables
    var map;
    var mapPanel;
    var GEOMcolumn;
    var epsg900913 = new OpenLayers.Projection('EPSG:900913');
    var epsg = new OpenLayers.Projection(geoserverWmsDefaults.wmsSrsName);
    var popup;

    var selectedLayer;
    var infoControls;
    var pgrid;
    var vector;
    var highlight;
    var table=[];
    var operators=[];

    Ext.require([
        'Ext.direct.*',
        'Ext.data.*',
        'Ext.tree.*',
        'Ext.Window',
        'Ext.container.Viewport',
        'Ext.layout.container.Border',
        'Ext.form.ComboBox',
        'GeoExt.tree.OverlayLayerContainer',
        'GeoExt.tree.BaseLayerContainer',
        'GeoExt.tree.View',
        'GeoExt.tree.Column',
        'GeoExt.data.ScaleStore',
        'GeoExt.data.LayerTreeModel',
        'GeoExt.data.proxy.Protocol',
        'Ext.tree.plugin.TreeViewDragDrop',
        'GeoExt.panel.Map',
        'GeoExt.Action',
        'GeoExt.window.Popup',
        'GeoExt.selection.FeatureModel',
        'Ext.grid.GridPanel',
        'GeoExt.grid.column.Symbolizer'
    ]);
</script>

<script src="../resources/js/libs/GISHelper.js"></script>
<script src="../resources/js/libs/Helper.js"></script>
<script src="../resources/js/libs/MapReport.js"></script>
<script src="../resources/js/libs/CustomControls.js"></script>
<script src="../resources/js/libs/DownloadAreas.js"></script>
<script src="../resources/js/libs/Measure.js"></script>
<script src="../resources/js/libs/login.js"></script>
<script type="text/javascript" src="../resources/js/panels.js"></script>


<script>
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
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.7;
        layer_style.graphicOpacity = 1;
        layer_style.fillColor ='#0000FF';
        layer_style.border = 3;

        vector = new OpenLayers.Layer.Vector("Result Layer", {
            style: layer_style,
            renderers: renderer,
            projection: epsg
        });

        highlight = new OpenLayers.Layer.Vector("Select Layer", {
            style: layer_style,
            renderers: renderer,
            projection: epsg
        });

        var selectCtrl = new OpenLayers.Control.SelectFeature(vector);

        //WMS CAPABILITIES
        wmscapstore = Ext.create('GeoExt.data.WmsCapabilitiesLayerStore', {
            storeId: 'wmscapsStore',
            method: 'POST',
            url: "cgi-bin/proxy.cgi?url="+encodeURIComponent(geoserverWmsDefaults.wmsUrl +"request=getCapabilities"),
            autoLoad: true
        });

        var menu = Ext.create('Ext.menu.Menu', {
            id: 'mainMenu',
            style: {
                overflow: 'visible'
            },
            items: [{
                xtype: 'button',
                text: LHideAll,
                handler: function() {
                    var treeNode = tree.getRootNode();
                    while(treeNode.childNodes[0].firstChild) {
                        treeNode.childNodes[0].removeChild(treeNode.childNodes[0].firstChild);
                    }
                    var tmenu = Ext.getCmp('mainMenu');
                    for(var i =1; i < tmenu.items.items.length; i++)
                    {
                        Ext.getCmp(tmenu.items.items[i].id).setChecked(false);
                    }
                }
            }]
        })

        function onItemCheck(item, checked) {
            var treeNode = tree.getRootNode();
            if (checked == false) {
                for (var j = 0; j < treeNode.childNodes[0].childNodes.length; j++) {
                    if (item.text == treeNode.getChildAt(0).getChildAt(j).data.text) {
                        map.removeLayer(item.llmap);
                        treeNode.getChildAt(0).getChildAt(j).remove(true);
                    }
                }
            }
            if (checked == true) {
                map.addLayer(item.llmap);
                treeNode.getChildAt(0).appendChild({
                    text: item.text,
                    layer: item.llmap,
                    leaf: true,
                    checked: false,
                    children: [],
                    nodeType: "gx_overlaylayercontainer"
                });
            }
        }
        // Dynamically add layers
        wmscapstore.load({
            callback: function (records, operation, success) {
                for (var i = 0; i < wmscapstore.data.keys.length; i++) {
                    for (var j = 0; j < wmscapstore.data.items[i].data.styles.length; j++) {
                        var opmap = new OpenLayers.Layer.WMS(
                                wmscapstore.data.items[i].data.title + " (" + wmscapstore.data.items[i].data.styles[j].name + ")", geoserverWmsDefaults.wmsUrl,
                                {
                                    LAYERS: wmscapstore.data.items[i].data.name,
                                    STYLES: wmscapstore.data.items[i].data.styles[j].name,
                                    format: 'image/png',
                                    transparent: true
                                },
                                {
                                    buffer: 0,
                                    displayOutsideMaxExtent: true,
                                    isBaseLayer: false,
                                    visibility: false
                                }
                        );

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

                        Ext.getCmp('mainMenu').add({
                            id: "id" + opmap.id,
                            text: opmap.name,
                            checked: true,
                            checkHandler: onItemCheck,
                            llmap: opmap
                        });

                        //CHECK WHETHER THERE IS A NEED TO REWRITE LAYERS TO POSTGRES DB
                        Ext.Ajax.request({
                            url: "rest/IdExists",
                            method: 'POST',
                            jsonData: {
                                Name: opmap.name,
                                Ns: "ELPHO",
                                Address: opmap.url,
                                Srs: geoserverWmsDefaults.wmsSrsName,
                                Visible: 1,
                                Userid: document.cookie.split("=")[1]
                            },
                            success: function (response, options) {
                                var result = Ext.JSON.decode(response.responseText);
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
                            },
                            failure: function (response, options) {
                            }
                        });

                    }
                }
            }
        });

        //add predifined local layers
        map.addLayer(layer);
        map.addLayer(vector);
        map.addLayer(highlight);

        //MEASUREMENTS
        var measurearea = Elpho.tools.MeasureAreaButton;
        var measureline = Elpho.tools.MeasureLineButton;

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
                var print = Ext.create(Elpho.widgets.MapPrintWindow);

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

        var uploadArea = Elpho.tools.DownloadParcelButton;

        ctrl = new OpenLayers.Control.NavigationHistory();
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
                        //url: 'rest/getControlAreas',
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
                            text: LUploadArea,
                            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                                var id = Ext.id();
                                Ext.defer(function () {
                                    Ext.widget('button', {
                                        renderTo: id,
                                        iconCls: 'icon-save',
                                        handler: function () {
                                            var selectedRecord = pgrid.getSelectionModel().getSelection()[0];
                                            var vlvalue = Ext.getCmp(selectedRecord.comboid).getValue();

                                            window.open(record.data.request);
                                            var ilots = record.data.request.replace("PARCELS_FINAL", "ILOTS");
                                            window.open(ilots);
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
                    title: LUploadArea,
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
                    ,
                    tbar:[
                        {
                            xtype: 'button',
                            text: LShowHideLayers,
                            margin: 5,
                            menu: menu
                        }
                    ]
                }
        );
        //tree item click event. gets the layer legend and the layer's geometry column name
       tree.on('itemclick', function(view, record, item, index, event) {
            selectedLayer = [record.data.layer];
            if(selectedLayer[0].params.STYLES!="") {
                Ext.get(legend_image).dom.src = geoserverWmsDefaults.wmsUrl + "REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=30&STRICT=false&style=" +
                        selectedLayer[0].params.STYLES;
            }
            Ext.Ajax.request({
                url: OpenLayers.ProxyHost + encodeURIComponent(geoserverWfsDefaults.wfsUrl + "request=describeFeatureType&typename=" + selectedLayer[0].params.LAYERS),
                method: 'GET',
                success: function (response, options) {
                    var result = response.responseXML;
                    var Columnchilds = result.children[0].children[1].children[0].children[0].children[0].children;
                    table.length = 0;

                    for (var i = 0; i < Columnchilds.length; i++) {
                        if (Columnchilds[i].attributes.type.nodeValue == "gml:GeometryPropertyType") {
                            GEOMcolumn = Columnchilds[i].attributes.name.nodeValue;
                        }
                        table[i] = {
                            value: i,
                            name: Columnchilds[i].attributes.name.nodeValue,
                            type: Columnchilds[i].attributes.type.nodeValue
                        };
                    }
                    selectedlayerfields.load();
                }
            });
        })

        //identify tool, located in the CustomControl.js file
        map.addControl(ident);

        var toppanel =  Ext.create('Ext.panel.Panel', {
            border: true,
            region: "north",
            height: 40,
            tbar: [zoomBox,navigate,previous, next,'|',measurearea, measureline,'|',IdentifyButton,'|', printbutton,'|', resetSelections, "|", uploadArea, downloadArea, "->", options, login]
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

        map.addControl(selectCtrl);
        map.addControl(infoControls);
        selectCtrl.activate();
    }



});
</script>

</head>
<body> </body>
</html>

/**
 * Created by stefanos on 5/11/2015.
 */
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
var layers=[];


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
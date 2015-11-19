Ext.define('CodenTonic.tools.vector.SelectFeatureButton', {
    extend: 'Ext.button.Button',
    xtype: 't_selectfeaturebutton',
    msgBoxTitle: 'Select Feature',
    msgBoxText: 'Feature: ',
    tooltip: 'Select Feature',
    requires: [
        'GeoExt.Action',
        'GeoExt.panel.Map'
    ],
    modifyCtrl: null,
    mapToggleGroup: "map-unique-action",
    iconCls: 'icon-feature-select',
    targetVectorLayer: null,
    dragHandleStyle: {
        graphicName: 'cross',
        stroke: false,
        fill: true,
        fillColor: 'red',
        fillOpacity: 1,
        pointRadius : 10,
        cursor: 'all-scroll'
    },
    map: null,
    constructor: function (cfg) {
        var me = this,
            action;

        me.map = map;

        Ext.apply(me, cfg || {});
        me.initControls();

        // handle errors if control is null or invalid
        action = Ext.create('GeoExt.Action', {
            tooltip: me.tooltip,
            map: map,
            control: me.modifyCtrl,
            pressed: false,
            enableToggle: true,
            toggleGroup: me.mapToggleGroup
        });
        me.callParent([action]);

        // Unregister all the events again
        me.on('beforedestroy', me.unregisterEvents, me);
    },
    initControls: function() {
        var me = this;
        me.selectCtrl = new OpenLayers.Control.SelectFeature(
            me.targetVectorLayer
        );

        var mode = OpenLayers.Control.ModifyFeature.RESHAPE |
            OpenLayers.Control.ModifyFeature.DRAG;

        me.modifyCtrl = new OpenLayers.Control.ModifyFeature(
            me.targetVectorLayer
        );
        me.modifyCtrl.mode = mode;

        me.modifyCtrl.collectDragHandle = function(){
            var proto = OpenLayers.Control.ModifyFeature.prototype;
            proto.collectDragHandle.apply(this, arguments);
            this.dragHandle.style = me.dragHandleStyle;
            this.dragHandle.layer.redraw();
        };

        me.map.addControl(me.selectCtrl);
        me.map.addControl(me.modifyCtrl);

        me.modifyCtrl.events.on({
            scope: me
            //'activate' : me.onModifyCtrlActivate,
            //'deactivate' : me.onModifyCtrlDeactivate
        });

        me.targetVectorLayer.events.on({
            scope: me,
            'featureselected' : me.selectNextBestFeatureForModification,
            'featureunselected' : me.onLayerFeatureUnselected,
            'featuremodified' : me.fireVertexClickOut,
            'beforefeaturemodified' : me.fireVertexClickOut
        });
    },
    onModifyCtrlActivate: function(evt) {
        this.selectCtrl.activate();
    },
    onModifyCtrlDeactivate: function(evt) {
        this.selectCtrl.deactivate();
    },
    fireVertexClickOut: function() {
        this.fireEvent("vertexclickout");
    },
    unregisterEvents: function() {
        var me = this;
        vector.events.un({
            scope: me,
            'featureselected' : me.selectNextBestFeatureForModification,
            'featureunselected' : me.onLayerFeatureUnselected
        });
    },
    onLayerFeatureUnselected: function(evt) {
        var me = this,
            feature = evt.feature;

        if(me.modifyCtrl.feature === feature){
            me.modifyCtrl.unselectFeature();
        }

        me.selectNextBestFeatureForModification();
    },
    selectNextBestFeatureForModification: function(evt) {
        var me = this,
            numberOfFeatures = vector.selectedFeatures.length;

        if(numberOfFeatures > 0){
            var nextBestFeature = vector.selectedFeatures[0];
            me.modifyCtrl.selectFeature(nextBestFeature);
        }
    },
    getModifyControl: function() {
        return this.modifyCtrl;
    }
});
/*global Ext, GeoExt, OpenLayers, GdaWasser*/
/*jshint camelcase:true, curly:true, eqeqeq:true, latedef:true, newcap:true, noarg:true, undef:true, trailing:true, maxlen:80 */
/**
 * @class
 */
Ext.define('CodenTonic.tools.vector.DrawButton', {
    extend: 'Ext.button.Button',
    xtype: 't_drawbutton',
    msgBoxTitle: 'Ψηφιοποιήση',
    msgBoxText: 'Οντότητα',
    tooltip: null,
    iconCls: null,
    handler: null,
    ltype: null,
    defaultHandlerOpts: {
        style: OpenLayers.Feature.Vector.style['default'],
        multi: false
    },
    mapToggleGroup: "map-unique-action",
    modifyFeatureControl: null,
    requires: [
        'GeoExt.Action'
    ],
    handlerOptions: null,
    sphericalMercatorSrsLookup: [
        'EPSG:2100',
        'EPSG:900913'
    ],
    constructor: function (cfg) {
        var me = this,
            action;

        Ext.apply(this, cfg || {});

        if(!Ext.isObject(me.handlerOpts)){
            // fallback to default opts
            me.handlerOpts = me.defaultHandlerOpts;
        }

        me.initControl(me.handler, me.handlerOpts);

        // handle errors if control is null or invalid
        action = Ext.create('GeoExt.Action', {
            control: me.control,
            map: map,
            tooltip: me.tooltip,
            enableToggle: true,
            activateOnEnable: false,
            toggleGroup: me.mapToggleGroup,
            allowDepress: true
        });
        me.callParent([action]);
    },
    initControl: function(handlerClass, handlerOpts) {
        var me = this;

        if(Ext.isObject(vector)){
            me.control = new OpenLayers.Control.DrawFeature(
                vector,
                handlerClass,{
                    handlerOptions: handlerOpts
                });

            me.control.events.register('featureadded', me, function(f) {
                f.feature.ltype = me.ltype;
                f.feature.pstate = "insert";
            });
            me.control.events.register("activate", me,
                me.startUndoRedoObserving);
            me.control.events.register("deactivate", me,
                me.stopUndoRedoObserving);

        } else {
            Ext.log.error("Error while initializing control: " +
                "Could not detect targetVectorLayer.");
        }
    },
    startUndoRedoObserving: function() {
        var me = this;
        OpenLayers.Event.observe(document, "keydown", me.undoRedoObserver);
    },
    stopUndoRedoObserving: function() {
        var me = this;
        OpenLayers.Event.stopObserving(document, "keydown",
            me.undoRedoObserver);
    }
});
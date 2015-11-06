//AREA
Ext.define('CodenTonic.tools.MeasureAreaButton', {
    extend: 'Ext.button.Button',
    xtype: 't_measureareabutton',
    msgBoxTitle: LMeasurment,
    msgBoxText: LArea,
    tooltip: LMeasureArea,
    iconCls: 'icon-measure-area',
    scale: 'medium',
    handlerClass: OpenLayers.Handler.Polygon,
    requires: [
        'GeoExt.Action'
    ],
    handlerOptions: null,
    sphericalMercatorSrsLookup: [
        epsg,
        epsg900913
    ],
    measureStyle: {
        fillColor: '#f00',
        fillOpacity: 0.3,
        strokeColor: '#e00000',
        strokeOpacity: 0.7,
        strokeWidth: 3,
        strokeLinecap: 'square',
        strokeDashstyle: 'dashdot'
    },

    mapToggleGroup: "tools",
    constructor: function (config) {
        var me = this,
            action;

        me.initHandlerOptions();
        me.initControl(me.handlerClass);

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
    initHandlerOptions: function() {
        var me = this;
        me.handlerOptions = {
            style: 'default',
            layerOptions: {
                styleMap: new OpenLayers.StyleMap({
                    'default': new OpenLayers.Style(me.measureStyle)
                })
            },
            persist: true
        };
    },
    initControl: function(handlerClass) {
        var me = this,
            geodesic = false;

        if(Ext.Array.contains(
            me.sphericalMercatorSrsLookup,
            map.getProjection()
        )
            ){
            geodesic = true;
        }

        me.control = new OpenLayers.Control.Measure(
            me.handlerClass, {
                geodesic: geodesic,
                handlerOptions: me.handlerOptions,
                eventListeners: {
                    measure: me.onMeasureComplete,
                    scope: me
                }
            }
        );
    },
    addThousandsSeparator : function(measure) {
        var measureStr = measure + "",
            indexOfPoint = Ext.Array.indexOf(measureStr, "."),
            integerPart = measureStr.substring(0, indexOfPoint),
            fractionalPart = measureStr.substring(indexOfPoint + 1),
            len = integerPart.length,
            formatted = "",
            cnt = 0;

        for (; len > 0; len-- && cnt++) {
            if (cnt > 0 && cnt % 3 === 0) {
                formatted = "." + formatted;
            }
            formatted = integerPart.charAt(len - 1) + formatted;
        }

        formatted = formatted + "," + fractionalPart;

        return formatted;
    },
    onMeasureComplete: function(e) {
        var me = this,
            infoTxt = me.msgBoxText+me.addThousandsSeparator(e.measure.toFixed(1))+ e.units;
        me.communicateMeasureResult(me.msgBoxTitle, infoTxt);
    },
    communicateMeasureResult: function(title, msg){
        Ext.Msg.show({
            title: title,
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO,
            animateTarget: this.el
        });
    }
});
//LINE
Ext.define('CodenTonic.tools.MeasureLineButton', {
    extend: 'Ext.button.Button',
    xtype: 't_measurelinebutton',
    msgBoxTitle: LMeasurment,
    msgBoxText: LDistance,
    tooltip: LMeasureDistance,
    iconCls: 'icon-measure-line',
    scale: 'medium',
    handlerClass: OpenLayers.Handler.Path,
    requires: [
        'GeoExt.Action'
    ],
    handlerOptions: null,
    sphericalMercatorSrsLookup: [
        'EPSG:2100',
        'EPSG:900913'
    ],
    measureStyle: {
        fillColor: '#f00',
        fillOpacity: 0.3,
        strokeColor: '#e00000',
        strokeOpacity: 0.7,
        strokeWidth: 3,
        strokeLinecap: 'square',
        strokeDashstyle: 'dashdot'
    },

    mapToggleGroup: "tools",
    constructor: function (config) {
        var me = this,
            action;

        me.initHandlerOptions();
        me.initControl(me.handlerClass);

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
    initHandlerOptions: function() {
        var me = this;
        me.handlerOptions = {
            style: 'default',
            layerOptions: {
                styleMap: new OpenLayers.StyleMap({
                    'default': new OpenLayers.Style(me.measureStyle)
                })
            },
            persist: true
        };
    },
    initControl: function(handlerClass) {
        var me = this,
            geodesic = false;

        if(Ext.Array.contains(
            me.sphericalMercatorSrsLookup,
            map.getProjection()
        )
            ){
            geodesic = true;
        }

        me.control = new OpenLayers.Control.Measure(
            me.handlerClass, {
                geodesic: geodesic,
                handlerOptions: me.handlerOptions,
                eventListeners: {
                    measure: me.onMeasureComplete,
                    scope: me
                }
            }
        );
    },
    addThousandsSeparator : function(measure) {
        var measureStr = measure + "",
            indexOfPoint = Ext.Array.indexOf(measureStr, "."),
            integerPart = measureStr.substring(0, indexOfPoint),
            fractionalPart = measureStr.substring(indexOfPoint + 1),
            len = integerPart.length,
            formatted = "",
            cnt = 0;

        for (; len > 0; len-- && cnt++) {
            if (cnt > 0 && cnt % 3 === 0) {
                formatted = "." + formatted;
            }
            formatted = integerPart.charAt(len - 1) + formatted;
        }

        formatted = formatted + "," + fractionalPart;

        return formatted;
    },
    onMeasureComplete: function(e) {
        var me = this,
            infoTxt =
                me.msgBoxText+me.addThousandsSeparator(e.measure.toFixed(1))+e.units;
        me.communicateMeasureResult(me.msgBoxTitle, infoTxt);
    },
    communicateMeasureResult: function(title, msg){
        Ext.Msg.show({
            title: title,
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO,
            animateTarget: this.el
        });
    }
});
Ext.define('Elpho.tools.ScaleCombo', {
    extend: 'Ext.form.ComboBox',
    xtype: 't_scale_combo',
    requires : [
        'GeoExt.data.ScaleStore',
        'GeoExt.panel.Map',

        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.XTemplate'
    ],
    statics: {
        formatScaleText: function (scale) {
            var scaleStr = (Math.round(scale / 10) * 10) + "",
                formatted = "",
                len = scaleStr.length,
                cnt = 0;
            for (;len > 0; len-- && cnt++) {
                if (cnt > 0 && cnt % 3 === 0) {
                    formatted = "." + formatted;
                }
                formatted = scaleStr.charAt(len - 1) + formatted;
            }
            return formatted;
        },
        formatScaleNumber: function (displayScale) {
            if (Ext.isString(displayScale)) {
                displayScale = displayScale.replace('.', '');
                return parseInt(Math.round(displayScale), 10);
            } else if (Ext.isNumber(displayScale)) {
                return displayScale;
            }
        }
    },
    emptyText: '',
    fieldLabel: "Κλίμακα",
    invalidScaleTypedText: '',
    map: null,
    store: null,
    labelWidth: 65,
    editable: true,
    forceSelection: false,
    enableKeyEvents: true,
    triggerAction: 'all',
    queryMode: 'local',
    allowedScaleNumRegex: /[0-9\.]/,
    constructor: function () {
        var me = this,
            tplCtx = {
                formatScale: function (values) {
                    var formatNs = Elpho.tools.ScaleCombo;
                    return formatNs.formatScaleText(values.scale);
                }
            },
            itemTpl =  Ext.create(
                'Ext.XTemplate',
                '{[this.formatScale(values)]}',
                tplCtx
            );
        me.regex = me.allowedScaleNumRegex;
        me.maskRe = me.allowedScaleNumRegex;
        me.regexText = me.invalidScaleTypedText;

        // layout the list_
        me.listConfig = {
            itemTpl: itemTpl
        };

        if (!Ext.isObject(map)) {
            map = GeoExt.panel.Map.guess().map;
        }
        me.store = Ext.create('GeoExt.data.ScaleStore', {
            map: map
        });

        me.callParent(arguments);
        me.registerEvents();
    },
    registerEvents: function () {
        var me = this,
            formatFunc = Elpho.tools.ScaleCombo.formatScaleNumber;

        // select a value from list
        me.on('select', function (combo, record) {
            map.zoomTo(record[0].get("level"));
        }, me);

        // typing in a arbitrary scale number
        me.on('keyup', function (textfield) {
            var sScale = textfield.getValue(),
                scaleNum = formatFunc(sScale);
            if (Ext.isNumber(scaleNum)) {
                map.zoomToScale(scaleNum);
            }
        }, me, {buffer: 500});

        me.on('afterrender', function () {
            map.events.register('zoomend', me, function () {

                var scaleNum = map.getScale(),
                    formatFunc = Elpho.tools.ScaleCombo.formatScaleText;
                scaleNum = parseInt(Math.round(scaleNum), 10);
                me.setValue(formatFunc(scaleNum));
            });
        }, me, {single: true});
    }
});

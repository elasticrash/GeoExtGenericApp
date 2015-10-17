/**
 * Created by stefanos on 26/3/2015.
 */
Ext.define('Elpho.widgets.panel.FeatureGridPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'w_featuregridpanel',
    requires: [
        'GeoExt.data.FeatureStore',
        'GeoExt.data.proxy.Protocol',
        'GeoExt.data.reader.Feature',
        'GeoExt.selection.FeatureModel',
        'Ext.grid.Panel',
        'Ext.grid.plugin.RowEditing'
    ],
    title: '',
    targetWmsLayer:null,
    targetVectorLayer:null,
    selectCtrl: null,
    protocolToUse: null,
    attrStoreToUse: null,
    grid: null,
    onFeatureStoreLoad: null,
    initComponent : function() {
        var me = this,
            protocol = (!Ext.isEmpty(me.protocolToUse)) ? me.protocolToUse :
                createOlProtocolFromWms(me.targetWmsLayer),
            attrStore = (!Ext.isEmpty(me.attrStoreToUse)) ? me.attrStoreToUse :
                getAttributeStore(me.targetWmsLayer, false);

        attrStore.on('load', function(store, records) {

            var array = ["PARCELS_ID",
                "PAR12_ID",
                "EDE12_ID",
                "EDA12_ID",
                "EDA12_KODIKOS",
                "EFY12_KODIKOS",
                "NEOXARTOYPOB",
                "AFM_1",
                "DTECHECKSTART",
                "DTECHECKEND",
                "DAA_KODIKOS",
                "DNM_KODIKOS",
                "OPD_ID",
                "NAME",
                "OPD_DESC",
                "CLE_ID",
                "CLE_KOD",
                "NPU_ID",
                "NPU_NAME",
                "EPILOGHTYPE",
                "GEOM"];

            for(var i = records.length - 1; i >= 0; i--) {
                if(array.indexOf(records[i].data.name) > 1) {
                    records.splice(i, 1);
                }
            }

            for(var i = store.data.items.length - 1; i >= 0; i--) {
                if(array.indexOf(store.data.items[i].data.name) > 1) {
                    store.data.items.splice(i, 1);
                    store.data.keys.splice(i, 1);
                }
            }

            var modelname = getAttributeModel(records, 'DigitizeLayerFeatureModel');
            var cols = getAttributeColumns(store, true);

            for(var i = 0; i < cols.length; i++) {
                if(altNamesTypes.indexOf(store.data.items[i].data.name) > 1) {
                    cols[i].text = altNames[altNamesTypes.indexOf(store.data.items[i].data.name)];
                }
            }

            var featureStore = Ext.create('GeoExt.data.FeatureStore', {
                    layer: me.targetVectorLayer,
                    model: modelname,
                    proxy: Ext.create('GeoExt.data.proxy.Protocol', {
                        model: modelname,
                        protocol: protocol,
                        reader: Ext.create('GeoExt.data.reader.Feature', {
                            root: 'features'
                        })
                    }),
                    autoLoad: true
                });

            featureStore.on('load', me.onFeatureStoreLoad);

            var selModel = Ext.create('GeoExt.selection.FeatureModel', {
                    selectControl: me.selectCtrl,
                    autoActivateControl: false,
                    allowDeselect: true,
                    mode: 'MULTI'
                }),

                grid = Ext.create('Ext.grid.Panel', {
                    border: false,
                    name: 'digi-feature-grid',
                    minHeight: 250,
                    selModel: selModel,
                    store: featureStore,
                    columns: cols,
                    bbar: [],
                    plugins: [
                        Ext.create('Ext.grid.plugin.RowEditing')
                    ],
                    listeners: {
                        'selectionchange': function(grid, selected, eOpts) {
                            if(Ext.isEmpty(selected)){
                                Ext.ComponentQuery.query("t_selectfeaturebutton")[0].toggle(false);
                            } else {
                                Ext.ComponentQuery.query("t_selectfeaturebutton")[0].toggle(true);
                            }
                        }
                    }
                });
            me.add(grid);
            me.grid = grid;
            me.fireEvent('gotdescribefeature', records);
        }, me);

        me.callParent(arguments);
    }
});
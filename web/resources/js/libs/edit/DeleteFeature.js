/**
 * Created by stefanos on 24/3/2015.
 */
/*global Ext*/
/*jslint plusplus: true, sloppy: true, white: true*/
/**
 * @class
 */
Ext.define('Elpho.tools.vector.DeleteFeatureButton', {
    extend: 'Ext.button.Button',
    xtype: 't_deletefeaturebutton',
    requires : [
    ],
    tooltip: '',
    confirmDeletionTitle: '',
    confirmDeletionText: '',
    alertTitle: '',
    noObjectSelectedText: '',
    modifyFeatureControl: null,
    iconCls: 'icon-feature-delete',
    mapToggleGroup: "map-unique-action",
    initComponent: function() {
        var me = this;
        me.on('click', me.onClick);
        me.callParent();
    },
    onClick: function(btn, e, eOpts) {
        var me = this,
            hsiSelectionLayer = vector,
            selectedHSIFeatures = hsiSelectionLayer.features,
            selectedModifyControlFeatures = me.modifyFeatureControl.layer.selectedFeatures;

        if (Ext.isObject(vector) &&
            (selectedModifyControlFeatures.length > 0 ||
                selectedHSIFeatures.length > 0)) {
            Ext.Msg.confirm(me.confirmDeletionTitle, me.confirmDeletionText, function(decision){
                if (decision === "yes") {
                    var deleteFeatures = [];
                    // double iterate needed as the sum of selectedfeatures changes during process..
                    Ext.each(selectedModifyControlFeatures, function(feature) {
                        deleteFeatures.push(feature);
                    });
                    me.deleteFeatures(deleteFeatures);
                }
            }, me);
        } else {
            Ext.Msg.alert(me.alertTitle, me.noObjectSelectedText);
        }
    },
    deleteFeatures: function(featureArray) {

        var me = this;
        me.modifyFeatureControl.unselectFeature();

        Ext.each(featureArray, function(feature) {
            vector.removeFeatures(feature);
        });
        //var hsiSelectionLayer = vector;
        //hsiSelectionLayer.removeAllFeatures();
    }
});

function CustomMessage(msgtitle,msg)
{
    Ext.Msg.show({
        title: msgtitle,
        msg: msg,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
    });
}

function CreateWFSUrl(request, typename)
{
    if(request == "describeFeatureType")
    {
        return geoserverWfsDefaults.wfsUrl + "request=describeFeatureType&typename=" + typename;
    }
    if(request == "GetFeature")
    {
        return  geoserverWfsDefaults.wfsUrl + "request=GetFeature&typeName="+ geoserverWfsDefaults.nsAlias+":" + typename + "&maxFeatures=1&outputFormat=application/json"
    }
}

function CreateWMSUrl(request, typename, style)
{
    if(request == "GetLegendGraphic")
    {
        return geoserverWmsDefaults.wmsUrl + "request=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=30&STRICT=false&style=" + style;
    }

}

function createPopup(feature, popgrid) {
    var win = Ext.WindowManager.getActive();
    if (win) {
        win.close();
    }
    popupOpts = Ext.apply({
        title: LInfo,
        location: feature,
        width:400,
        map:map,
        layout   : 'fit',
        maximizable: true,
        collapsible: true,
        anchorPosition: 'auto',
        items:[popgrid]
    });

    popup = Ext.create('GeoExt.window.Popup', popupOpts);
    popup.on({
        close: function() {
            vector.removeAllFeatures();
        }
    });
    popup.show();
}


function EditAttributes(feature, popgrid) {
    var win = Ext.WindowManager.getActive();
    if (win) {
        win.close();
    }
    popupOpts = Ext.apply({
        title: "Add Attributes",
        location: feature,
        width:400,
        map:map,
        layout   : 'fit',
        maximizable: true,
        collapsible: true,
        anchorPosition: 'auto',
        items:[popgrid],
        bbar: [
            {
                id: 'addattributevalues',
                xtype: 'button',
                text: "OK",
                margin: 5,
                handler: function () {
                    //pass attributes
                    win.close();
                }
            }
        ]
    });

    popup = Ext.create('GeoExt.window.Popup', popupOpts);
    popup.on({
        close: function() {
        }
    });
    popup.show();
}
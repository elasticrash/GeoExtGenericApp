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
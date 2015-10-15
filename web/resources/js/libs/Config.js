var geoserver = "http://144.76.39.165:8082/";
var geoserverwms = "http://geoserver.elpho.biz/";

var geoserverWfsDefaults= {
        wfsUrl: geoserver+ "geoserver/ELPHO/wfs?",
        wfsFeatureNS: "http://demo-greece/Greek",
        wfsVersion: "1.0.0",
        wfsSrsName: "EPSG:2100",
        nsAlias: 'ELPHO',
        wfsCapabilities: '<GetCapabilities service="WFS" version="1.0.0" xmlns="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"/>'
}
var geoserverWmsDefaults= {
    wmsUrl: geoserverwms+"geoserver/ELPHO/wms?",
    wmsSrsName: "EPSG:2100",
    nsAlias: 'ELPHO'
}
var apolloWmsDefaults= {
    wmsUrlvector: "http://neptune:80/erdas-apollo/vector/ORAELPHO11G_RSdb?service=WMS",
    wmsUrlcoverage: "http://neptune:80/erdas-apollo/coverage/TEST?service=WMS",
    wmsSrsName: "EPSG:2100",
    nsAlias: 'ELPHO'
}
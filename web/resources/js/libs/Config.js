var geoserver = "http://XXX.XX.XX.XXX:8080/";

var geoserverWfsDefaults= {
        wfsUrl: geoserver+ "geoserver/ELPHO/wfs?",
        wfsFeatureNS: "http://demo-greece/Greek",
        wfsVersion: "1.0.0",
        wfsSrsName: "EPSG:2100",
        nsAlias: 'ELPHO',
        wfsCapabilities: '<GetCapabilities service="WFS" version="1.0.0" xmlns="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"/>'
}
var geoserverWmsDefaults= {
    wmsUrl: geoserver+"geoserver/ELPHO/wms?",
    wmsSrsName: "EPSG:2100",
    nsAlias: 'ELPHO'
}

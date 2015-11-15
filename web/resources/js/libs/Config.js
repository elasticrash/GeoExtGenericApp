var geoserver = "http://localhost:8080/";

var geoserverWfsDefaults= {
        wfsUrl: geoserver+ "geoserver/ELPHO/wfs?",
        wfsFeatureNS: "http://demo-greece/Greek",
        wfsVersion: "1.0.0",
        wfsSrsName: "EPSG:2100",
        nsAlias: 'ELPHO'
};
var geoserverWmsDefaults= {
    wmsUrl: geoserver+"geoserver/ELPHO/wms?",
    wmsSrsName: "EPSG:2100",
    nsAlias: 'ELPHO'
};

var toolcategories={
    maintools: true,
    measuretools: true,
    identifytool: true,
    printtools: true,
    resetselectiontool: true,
    saveareatools: true,
    edittools: true
}
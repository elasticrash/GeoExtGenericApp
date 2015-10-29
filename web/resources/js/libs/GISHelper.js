    function setActiveLayerForSelection(layerForSelection){
        var mapPanel = getMapPanel();
        if(!Ext.isEmpty(mapPanel)){
            if(layerForSelection.indexOf(":") === -1){
                layerForSelection = geoserverWfsDefaults.nsAlias + ":" + layerForSelection;
            }
            mapPanel.activeLayerForSelection = layerForSelection;
        }
    };


    function getActiveLayerForSelection(){
        var mapPanel = getMapPanel();
        if(!Ext.isEmpty(mapPanel) && mapPanel.activeLayerForSelection){
            return mapPanel.activeLayerForSelection;
        }
        return null;
    };

    function setSelectionVectorLayer(vectorLayer){
        var mapPanel = getMapPanel();
        if(!Ext.isEmpty(mapPanel) && !Ext.isEmpty(vectorLayer)){
            mapPanel.selectionVectorLayer = vectorLayer;
        }
    };

    function getSelectionVectorLayer(){
        var mapPanel = getMapPanel();
        if(!Ext.isEmpty(mapPanel) && mapPanel.selectionVectorLayer){
            return mapPanel.selectionVectorLayer;
        }
        return null;
    };

    function setHoverVectorLayer(vectorLayer){
        var mapPanel = getMapPanel();
        if(!Ext.isEmpty(mapPanel) && !Ext.isEmpty(vectorLayer)){
            mapPanel.hoverVectorLayer = vectorLayer;
        }
    };

    function getHoverVectorLayer(){
        var mapPanel = getMapPanel();
        if(!Ext.isEmpty(mapPanel) && mapPanel.hoverVectorLayer){
            return mapPanel.hoverVectorLayer;
        }
        return null;
    };

    function getMapPanel(){
        var mapPanels = Ext.ComponentQuery.query('gx_mappanel');
        if(!Ext.isEmpty(mapPanels) && mapPanels.length === 1){
            return mapPanels[0];
        }
        return null;
    };

     function getSelectionLayerFromFeature(feature) {
        var fid = feature.fid,
            layername = null;

        if (fid && fid.length > 0) {
            var lIdxPoint = fid.lastIndexOf('.');
            layername = fid.substring(0, lIdxPoint);
        }
        return layername;
    };

    function getLayerNameByLayerParam(layersParam) {
        var layerName = null,
            map = GeoExt.MapPanel.guess().map,
            allWmsLayers = map.getLayersByClass('OpenLayers.Layer.WMS');
        // make all layer names qualified.
        if(layersParam.indexOf(':') === -1){
            // use our namespace as prefix
            layersParam = geoserverWfsDefaults.nsAlias + ":" + layersParam;
        }
        // find the WMS-Layers and make them visible
        Ext.each(allWmsLayers, function(layer) {
            if(layer.params && layer.params.LAYERS && layer.params.LAYERS === layersParam){
                layerName = layer.name;
                // this will only break from Ext.each()
                return false;
            }
        });
        return layerName;
    };

    function getLayerbyName(layername){
        for(var o = 0; o <map.layers.length; o++)
        {
            if(map.layers[o].name == layername)
            {
                return map.layers[o];
            }
        }
        return null;
    };

    function getwmsCapLayerbyName(layername, wmscapstore){
        for (var i = 0; i < wmscapstore.data.keys.length; i++) {
            for (var j = 0; j < wmscapstore.data.items[i].data.styles.length; j++) {
                if (wmscapstore.data.items[i].data.title + " (" + wmscapstore.data.items[i].data.styles[j].name + ")" == layername) {
                    return [wmscapstore.data.items[i].data, j];
                }
            }
        }
        return null;
    };
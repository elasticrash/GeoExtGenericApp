/**
 * Created by tougo on 26/10/15.
 */
function OpenOptionForm(tree, layers) {

    var wsize = Ext.getBody().getViewSize();

    var optionform = new Ext.Window({
        title: 'Options',
        width: wsize.width/2,
        height: wsize.height/2,
        autoScroll: true,
        items: [{
            id: 'layerfieldset',
            xtype: 'fieldset',
            title: "Layer Visibility",
            collapsible: true,
            autoHeight: true,
            margin: 10,
            items:[{
                xtype: 'checkboxgroup',
                columns: 3,
                items: layers
            }]
        },
        {
            xtype: 'button',
            text: LHideAll,
            handler: function() {
                var treeNode = tree.getRootNode();
                while(treeNode.childNodes[0].firstChild) {
                    treeNode.childNodes[0].removeChild(treeNode.childNodes[0].firstChild);
                }
                var tmenu = Ext.getCmp('layerfieldset');
                for(var i =1; i < tmenu.items.items[0].items.length; i++)
                {
                    Ext.getCmp(tmenu.items.items[0].items.items[i].id).checked =false;
                    Ext.getCmp(tmenu.items.items[0].items.items[i].id).removeCls('x-form-cb-checked x-form-dirty');
                    Ext.getCmp(tmenu.items.items[0].items.items[i].id).checkChange();
                }
            }
         }]
    });

    function onItemCheck(item, checked) {
        var treeNode = tree.getRootNode();
        if (checked == false) {
            for (var j = 0; j < treeNode.childNodes[0].childNodes.length; j++) {
                if (item.text == treeNode.getChildAt(0).getChildAt(j).data.text) {
                    map.removeLayer(item.llmap);
                    treeNode.getChildAt(0).getChildAt(j).remove(true);
                }
            }
        }
        if (checked == true) {
            map.addLayer(item.llmap);
            treeNode.getChildAt(0).appendChild({
                text: item.text,
                layer: item.llmap,
                leaf: true,
                checked: false,
                children: [],
                nodeType: "gx_overlaylayercontainer"
            });
        }
    }
    optionform.show();
}

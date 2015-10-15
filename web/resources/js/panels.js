/**
 * Created by stefanos on 8/10/2015.
 */
//GENERIC
var Search="Search";
var None = "Select";
var To = "From";
//ANAZHTHSH ME SYNTETAGMENH
var CoordinateSearch= "Go to Coordinate";

Ext.define('AuadminList', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'ifcid', type:'int'},
        {name:'name', type:'string'},
        {name: 'upperLevelUnit', type:'int'},
    ]
});

Ext.define('LutModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'lutid', type:'int'},
        {name:'description', type:'string'},
        {name: 'code', type:'string'},
        {name: 'luttableid', type:'string'},
    ]
});

var AllLut = Ext.create('Ext.data.Store', {
    model: 'LutModel',
    proxy: {
        type: 'ajax',
        url: 'rest/lutdesc/findall',
        method: "GET",
        reader: {
            type: 'json',
            root: ''
        }
    }
});

//PARCEL GRID
Ext.define('ParcelList', {
    extend: 'Ext.data.Model',
    fields: ['parcelId','geom'],
    hasMany:[{model:'ParcelNatnit',name:'parcelNatnit'}]
});

//OPERATOR STORE
Ext.define('LookupModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'code', type:'string'},
        {name:'description', type:'string'}
    ]
});

var spoperatorstore = Ext.create('Ext.data.Store', {
    fields: ['value', 'name'],
    data : [
        {"value":1, "name":">"},
        {"value":2, "name":"<"},
        {"value":3, "name":"="},
    ]
});


var search_panel = [
    //ANAZHTHSH ME SYNTETAGMENI
    {
        xtype: 'fieldset',
        title: CoordinateSearch,
        autoHeight: true,
        anchor: '80%',
        margin: 10,
        items: [{
            xtype: 'textfield',
            anchor: '95%',
            id: 'x_id',
            width: 220,
            fieldLabel: "X"
        }, {
            xtype: 'textfield',
            anchor: '95%',
            id: 'y_id',
            width: 220,
            fieldLabel: "Y"
        },
            {
                xtype: 'button',
                text: Search,
                margin: 10,
                handler: function () {
                    GotoCoordinates();
                }
            }
        ]
    },
//YPOMNIMA
    {
        xtype: 'fieldset',
        title: "Legend",
        autoHeight: true,
        anchor: '80%',
        margin: 10,
        items: [
            {
                xtype:'image',
                title: "Legend",
                id: 'legend_image'
            }
        ]
    }];

var itemtab = Ext.create('Ext.tab.Panel', {
    layout:'fit',
    height: '100%',
    activeTab: 0,
    border: false,
    autoHeight: true,
    items: [
        {
            title: 'Search Panel',
            items:search_panel
        }
    ]
});

var east_search_panel = Ext.create('Ext.panel.Panel', {
    region: 'east',
    width: 480,
    collapsible: true,
    items: itemtab,
    layout:'fit',
    autoScroll: true
});

function GotoCoordinates()
{
    var x=Ext.getCmp('x_id').getValue();
    var y=Ext.getCmp('y_id').getValue();

    var lt =new OpenLayers.LonLat(x, y,2).transform(epsg, new OpenLayers.Projection('EPSG:900913'));
    map.setCenter(lt,18);
}

function deepCloneStore (source) {
    var target = Ext.create ('Ext.data.Store', {
        model: source.model
    });

    Ext.each (source.getRange (), function (record) {
        var newRecordData = Ext.clone (record.copy().data);
        var model = new source.model (newRecordData, newRecordData.id);

        target.add (model);
    });

    return target;
}
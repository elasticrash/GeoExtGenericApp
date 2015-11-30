Ext.define('CodenTonic.tools.vector.SymplifyPolygon', {
    extend: 'Ext.button.Button',
    xtype: 't_simplifypolygonbutton',
    requires : [
    ],
    map: null,
    targetVectorLayer: null,
    targetWmsLayer: null,
    featureStore: null,
    initComponent: function() {
        var me = this;
        me.mapPanel = mapPanel;
        me.map = map;
        me.on('click', me.onClick);
        me.callParent();
    },
    onClick: function(btn, e, eOpts) {
        var me = this;
        var features = me.checkWhichFeaturesAreSelected();
        var ft = features;
        me.tolerancePopup(me.SimplifyPolygon, ft, me.createNewFeature, me.targetVectorLayer);
    },
    checkWhichFeaturesAreSelected: function()
    {
        var me = this;

        var features = [];

        for(var i = 0; i < me.targetVectorLayer.features.length; i++)
        {
            var isSelected = me.targetVectorLayer.selectedFeatures.indexOf(me.targetVectorLayer.features[i]);
            if(isSelected == 0)
            {
                features.push(me.targetVectorLayer.features[i]);
            }
        }
        return features;
    },
    SimplifyPolygon: function(polygon, tolerance, cnf, target) {
        var simplefiedPolygon = [];
        var truePolygon = polygon[0].geometry.components[0].getVertices();

        simplefiedPolygon[0] = new OpenLayers.Geometry.Point(truePolygon[0].x, truePolygon[0].y);

        var ivertex = 0;
        var ipoint = 0;

        for (var c = 0; c < truePolygon.length - 2; c++) {
            var point1 = [];

            point1 = new OpenLayers.Geometry.Point(truePolygon[ivertex].x, truePolygon[ivertex].y);

            var point2 = [];
            point2 = new OpenLayers.Geometry.Point(truePolygon[c + 2].x, truePolygon[c + 2].y);

            var MidPoints = [];

            for (var j = 0; j < (c + 1 - ivertex); j++) {
                MidPoints[j] = truePolygon[ivertex + j + 1];
            }

            var D = Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
            var y1my2 = (point1.y - point2.y);
            var x2mx1 = (point2.x - point1.x);
            var C = (point2.y * point1.x) - (point1.y * point2.x);

            var run = 1;

            for (var i = 0; i < MidPoints.length; i++) {
                var dist = Math.abs(MidPoints[i].x * y1my2 + MidPoints[i].y * x2mx1 + C) / D;
                if (dist > tolerance) {
                    run = -1;
                }
            }

            if (run == -1) {
                ipoint++;
                ivertex = c + 1;
                simplefiedPolygon[ipoint] = new OpenLayers.Geometry.Point(truePolygon[c + 1].x, truePolygon[c + 1].y);
            }
        }
        simplefiedPolygon[ipoint + 1] = new OpenLayers.Geometry.Point(truePolygon[truePolygon.length - 2].x, truePolygon[truePolygon.length - 2].y);
        simplefiedPolygon[ipoint + 2] = new OpenLayers.Geometry.Point(truePolygon[truePolygon.length - 1].x, truePolygon[truePolygon.length - 1].y);
        cnf(polygon, simplefiedPolygon, target);
    },
    tolerancePopup:function (SP, ft, cnf, target) {
        var lform = new Ext.Window({
            title: "tolerance",
            bodyPadding: 5,
            defaultType: 'textfield',
            items: [
                {
                    id: 'tolid',
                    fieldLabel: 'tolerance',
                    name: 'tolerance',
                    allowBlank: true
                }
            ],
            bbar: [
                {
                    id: 'tolbtnid',
                    xtype: 'button',
                    text: "OK",
                    margin: 5,
                    handler: function () {
                        var tolerance = Ext.getCmp('tolid').value;

                        SP(ft, tolerance, cnf, target);
                        lform.close();
                    }
                }
            ]
        });
        lform.show();
    },
    createNewFeature: function(featureArray, featurenew, target)
    {
        var ring = new OpenLayers.Geometry.LinearRing(featurenew);
        var polygon = new OpenLayers.Geometry.Polygon([ring]);
        var attributes = {name: "my name", bar: "foo"};
        var feature = new OpenLayers.Feature.Vector(polygon, attributes);
        target.addFeatures([feature]);
        selectControl = new OpenLayers.Control.SelectFeature(target);
        selectControl.unselectAll();
        Ext.each(featureArray, function (ft) {
            target.removeFeatures(ft);
        });
    }
});

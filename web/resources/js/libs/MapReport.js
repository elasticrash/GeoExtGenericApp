Ext.define('Elpho.widgets.MapPrintWindow', {
    extend: 'Ext.window.Window',
    xtype: 'w_mapprintwindow',
    requires: [
        'Ext.XTemplate',
        'GeoExt.plugins.PrintExtent',
        'GeoExt.plugins.PrintPageField',
        'GeoExt.data.MapfishPrintProvider',
        'GeoExt.plugins.PrintProviderField',
        'GeoExt.panel.Legend'
    ],
    a3LandscapeFormatText: 'A3',
    a4LandscapeFormatText: 'A4',
    autoGenComment: 'Αυτοδημιούργητο',
    chooseFormatText: 'Επιλέξτε Μέγεθός και προσανατολισμό',
    descFieldLabel: 'Περιγραφή',
    errorLabel: 'Σφάλμα',
    generalText: 'Γενικά',
    incompleteFormText: 'Παρακαλούμε συμπληρώστε όλα τα πεδία',
    insertDescText: 'Παρακαλώ εισάγετε μια περιγραφή',
    insertTitleText: 'Παρακαλώ εισάγετε έναν τίτλο',
    optionsText: 'Επιλογές',
    portraitFormat: 'Πορτραίτο',
    previewCommentText: 'προεπισκόπηση σχόλιου',
    previewText: 'προεπισκόπηση',
    printErrorText: 'Εμφανίστηκε ένα σφάλμα κατά την εκτύπωση',
    printLayoutLabel: 'Διάταξη εκτύπωσης',
    printPropertiesText: 'ιδιότητες εκτύπωσης',
    printText: 'Εκτύπωση',
    resetFieldsText: 'Επαναφορά πεδίων',
    resolutionLabel: 'Ανάλυση',
    scaleLabel: 'Κλίμακα',
    selectResolutionText: 'Επιλογή Ανάλυσης',
    selectScaleText: 'Επιλογή Κλίμακας',
    title: 'Εκτύπωση χάρτη',
    titleFieldLabel: 'Τίτλός',
    workPrintHtml : 'Επιλέξτε ένα κόμματι χάρτη και στη συνέχεια, πατήστε το κουμπί της εκτύπωσης',
    workPrintTitle: 'Εκτύπωση Εργασίας',
    resizable: false,
    layout: 'table',
    border: 0,
    printCapabilities: null,
    collapsible: true,
    listeners: {
        'show' : function() {
        },
        'close' : function() {
        }
    },

    config: {
        workprint: false
    },

    statics: {
        hideLoadingMask: function() {
            var pv = Ext.ComponentQuery.query('[name="previewPanel"]')[0];
            if (pv) {
                pv.setLoading(false);
            }
        }
    },
    initComponent: function() {
        var me = this;

        // adjust the window
        me.x = 50;

        //check for already existing printwindow, destroy it and remove its layer if already there
        var printwindow = Ext.ComponentQuery.query('w_mapprintwindow')[0];
        if (printwindow) {
            printwindow.close();
        }

        var printCapabilities={"scales":[{"name":"1:1.000","value":"1000"},{"name":"1:2.000","value":"2000"},{"name":"1:4.000","value":"4000"},{"name":"1:8.000","value":"8000"},{"name":"1:16.000","value":"16000"},{"name":"1:32.000","value":"32000"},{"name":"1:64.000","value":"64000"},{"name":"1:128.000","value":"128000"},{"name":"1:256.000","value":"256000"},{"name":"1:512.000","value":"512000"},{"name":"1:1.024.000","value":"1024000"},{"name":"1:2.048.000","value":"2048000"},{"name":"1:4.096.000","value":"4096000"},{"name":"1:8.192.000","value":"8192000"},{"name":"1:16.384.000","value":"16384000"},{"name":"1:32.768.000","value":"32768000"},{"name":"1:65.536.000","value":"65536000"},{"name":"1:131.072.000","value":"131072000"},{"name":"1:262.144.000","value":"262144000"},{"name":"1:524.288.000","value":"524288000"}],"dpis":[{"name":"75","value":"75"},{"name":"150","value":"150"},{"name":"300","value":"300"}],"layouts":[{"name":"A4","map":{"width":440,"height":600},"rotation":true},{"name":"Legal","map":{"width":440,"height":650},"rotation":true},{"name":"Letter","map":{"width":440,"height":550},"rotation":true}],"printURL":"cgi-bin/proxy.cgi?url=http://144.76.39.165:8082/geoserver/pdf/print.pdf","createURL":"cgi-bin/proxy.cgi?url=http://144.76.39.165:8082/geoserver/pdf/create.json"};

        var printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
            method: "POST", // "POST" recommended for production use
            capabilities: printCapabilities
        });

        printProvider.addListener('printexception', function() {
            Ext.Msg.alert(me.errorLabel, me.printErrorText);
            Elpho.widgets.MapPrintWindow.hideLoadingMask();
            var pw = Ext.ComponentQuery.query('w_mapprintwindow')[0];
            if (pw) {
                pw.setLoading(false);
            }
        });

        printProvider.addListener('beforeprint', function(pp, map, page, options) {
            //create a legendpanel and add it to the print as option
            //options.legend = me.createPrintLegends();
        });

        var printExtent = Ext.create('GeoExt.plugins.PrintExtent', {
                printProvider: printProvider
            });
//            mapPanel = Ext.ComponentQuery.query('gx_mappanel')[0],
//            map = mapPanel.map;

        printExtent.init(mapPanel);

        if (!printExtent.page || printExtent.page === null) {
            printExtent.addPage();
        }
        printExtent.show();

        printExtent.page.on("change", function(pp, change) {
            //we only look at changes in scale
            if (change.scale) {
                if(Ext.ComponentQuery.query("combo[name='scalecombo']")[0]) {
                    Ext.ComponentQuery.query("combo[name='scalecombo']")[0].setValue(change.scale.data.value);
                }
            }
        });

        if (me.getWorkprint()) {
            // setting the layout to workprint
            var workPrintRec = printProvider.layouts.findRecord("name", "Arbeitsausdruck");
            printProvider.setLayout(workPrintRec);

            me.setTitle(me.workPrintTitle);
            Ext.applyIf(me, {
                width: 380,
                height: 120,
                html: me.workPrintHtml,
                buttons: [{
                    text: me.printText,
                    handler: function() {
                        var workprintwindow = Ext.ComponentQuery.query('w_mapprintwindow')[0];

                        printProvider.addListener('beforedownload', function(printProvider, url) {
                            workprintwindow.setLoading(false);
                        }, this, {single: true});

                        printProvider.customParams.outputFormat = "pdf";
                        printProvider.customParams.mapTitle = me.workPrintTitle;
                        printProvider.customParams.comment = me.autoGenComment;

                        printProvider.print(mapPanel, printExtent.page);

                        workprintwindow.setLoading(true);
                    }
                }]
            });

        } else {
            // filter the store to only show "Querformat" entries. see #520
            //printProvider.layouts.filter('name', /.Querformat$/);
            //show the complete printdialog
            Ext.applyIf(me, {
                height: 460,
                items: [
                    {
                        xtype: 'panel',
                        title: me.optionsText,
                        border: 0,
                        height: 430,
                        width: 350,
                        items: [{
                            xtype: 'fieldset',
                            title: me.generalText,
                            border: 1,
                            margin: 5,
                            items: [{
                                xtype: "textarea",
                                name: "mapTitle",
                                height: 40,
                                maxLength: 40,
                                enforceMaxLength: true,
                                emptyText: me.insertTitleText,
                                allowBlank: false,
                                fieldLabel: me.titleFieldLabel,
                                plugins: Ext.create('GeoExt.plugins.PrintPageField', {
                                    printPage: printExtent.page
                                })
                            },{
                                xtype: "textarea",
                                name: "comment",
                                height: 70,
                                maxLength: 90,
                                enforceMaxLength: true,
                                emptyText: me.insertDescText,
                                allowBlank: false,
                                fieldLabel: me.descFieldLabel,
                                plugins: Ext.create('GeoExt.plugins.PrintPageField', {
                                    printPage: printExtent.page
                                })
                            }]
                        },{
                            xtype: 'fieldset',
                            title: me.printPropertiesText,
                            border: 1,
                            margin: 5,
                            items: [{
                                xtype: 'combobox',
                                name: 'layoutcombo',
                                queryMode: 'local',
                                store: printProvider.layouts,
                                displayField: "name",
                                emptyText: me.chooseFormatText,
                                fieldLabel: me.printLayoutLabel,
                                allowBlank: false,
                                typeAhead: true,
                                triggerAction: "all",
                                plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
                                    printProvider: printProvider
                                }),
                                listeners: {
                                    afterrender: function(combobox) {
//                                        var a3LandscapeRec = combobox.store.findRecord("name", "A3"),
//                                            a4LandscapeRec = combobox.store.findRecord("name", "A4");
//                                        a3LandscapeRec.set('displayname', me.a3LandscapeFormatText);
//                                        a4LandscapeRec.set('displayname', me.a4LandscapeFormatText);
//                                        combobox.setValue(a3LandscapeRec);
                                    }
                                }
                            },{
                                xtype: 'combo',
                                store: printProvider.scales,
                                name: 'scalecombo',
                                forceSelection: true,
                                value: printExtent.page.scale.data.value,
                                displayField: 'name',
                                valueField: 'value',
                                queryMode: 'local',
                                emptyText: me.selectScaleText,
                                fieldLabel: me.scaleLabel,
                                allowBlank: false,
                                typeAhead: true,
                                triggerAction: "all",
                                plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
                                    printProvider: printProvider
                                }),
                                listeners: {
                                    select: function(combo, valuearray) {
                                        if (valuearray[0]) {
                                            printExtent.page.setScale(valuearray[0]);
                                        }
                                    }
                                }
                            },{
                                xtype: "combo",
                                store: printProvider.dpis,
                                name: 'resolutioncombo',
                                displayField: "name",
                                fieldLabel: me.resolutionLabel,
                                emptyText: me.selectResolutionText,
                                allowBlank: false,
                                displayTpl: Ext.create('Ext.XTemplate', '<tpl for=".">{name} dpi</tpl>'),
                                tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{name} dpi</li></tpl>',
                                typeAhead: true,
                                queryMode: "local",
                                triggerAction: "all",
                                plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
                                    printProvider: printProvider
                                })
                            }]
                        },
                            {
                                xtype: 'fieldset',
                                border: 1,
                                margin: 5,
                                items: [
                                   {
                                        xtype: 'button',
                                        margin: '0 0 0 15',
                                        text: me.resetFieldsText,
                                        handler: me.resetForm
                                    },{
                                        text: me.printText,
                                        xtype: 'button',
                                        margin: '0 0 0 15',
                                        handler: function() {
                                            me.doPdfPrint(printProvider, mapPanel, printExtent.page);
                                        }
                                    }
                                ]
                            }
                        ]
                    }]
            });
        }

        me.on("close", function() {
            map.removeLayer(printExtent.page.feature.layer);
        });

        me.callParent(arguments);
        me.show();

    },
    resetForm: function() {
        Ext.ComponentQuery.query("textfield[name='mapTitle']")[0].setValue();
        Ext.ComponentQuery.query("textfield[name='comment']")[0].setValue();
        Ext.ComponentQuery.query("combo[name='layoutcombo']")[0].setValue();
        Ext.ComponentQuery.query("combo[name='scalecombo']")[0].setValue();
        Ext.ComponentQuery.query("combo[name='resolutioncombo']")[0].setValue();
    },

    doPdfPrint: function(printProvider, mapPanel, printExtentPage) {

        var me = this,
            title = Ext.ComponentQuery.query("textfield[name='mapTitle']")[0].getValue(),
            comment = Ext.ComponentQuery.query("textfield[name='comment']")[0].getValue(),
            resolution = Ext.ComponentQuery.query("combo[name='resolutioncombo']")[0].getValue(),
            pw = Ext.ComponentQuery.query('w_mapprintwindow')[0];

        if (Ext.isEmpty(title) || Ext.isEmpty(comment)) {
            Ext.Msg.alert(me.errorLabel, me.incompleteFormText);
        } else {
            //eplicit override necessary if a preview with no title/comment has been made before:
            printProvider.customParams.mapTitle = title;
            printProvider.customParams.comment = comment;
            printProvider.dpi.data.value = resolution;

            delete printProvider.customParams.outputFormat;

            printProvider.addListener('beforedownload', function() {
                pw.setLoading(false);
            }, this, {single: true});

            printProvider.print(mapPanel, printExtentPage);
            pw.setLoading(true);
        }
    },

    showPrintPreview: function (printProvider, mp, pp) {

        var me = this,
            title = Ext.ComponentQuery.query("textfield[name='mapTitle']")[0].getValue(),
            comment = Ext.ComponentQuery.query("textfield[name='comment']")[0].getValue(),
            format = printProvider.layout.data.name,
            pv = Ext.ComponentQuery.query('[name="previewPanel"]')[0];

        //TODO: translate
        if (Ext.isEmpty(title)) {
            printProvider.customParams.mapTitle = me.previewText;
        }
        if (Ext.isEmpty(comment)) {
            printProvider.customParams.comment = me.previewCommentText;
        }

        printProvider.customParams.outputFormat = "png";

        // always print preview with 72 dpi
        printProvider.dpi.data.value = 75;

        printProvider.addListener('beforedownload', function(pp, call2servlet) {
            var src;
            src = '<center><img src="' + call2servlet + '" onload="Elpho.widgets.MapPrintWindow.hideLoadingMask();" width="337" height="238" style="background:white; border:1px solid black; box-shadow: 3px 3px 4px #000;" /></center>';
            pv.update(src);
            return false;
        }, this, {single: true});

        printProvider.print(mp, pp);

        pv.setLoading(true);
    },
    createPrintLegends: function() {

        //TODO: Refactor the way we retrieve visible legends, this is more or less a workaround
        var me = this,
            mapPanel = GeoExt.MapPanel.guess(),
            //view = Ext.ComponentQuery.query('w_layertreepanel')[0].getView(),
            //hiddenElements = Ext.DomQuery.select('[class*=gx-tree-layer-icon-hiddenlegend]', view.all.elements),
            hiddenLegends = [],
            visibleLegends = [];

//        Ext.each(hiddenElements, function(el) {
//            var domEl = Ext.get(el),
//                layerName = domEl.dom.parentNode.innerText;
//            //removing carriage returns from text
//            var escapedLayerName = layerName.replace(/(\n|\r\n)/g, '');
//            hiddenLegends.push(escapedLayerName);
//        });

        mapPanel.layers.each(function(layerrec) {
            var title = layerrec.get('title');
            if (!Ext.Array.contains(hiddenLegends, title)) {
                visibleLegends.push(layerrec);
            }
        });

        var legendpanels = Ext.ComponentQuery.query('gx_legendpanel');
        if (!Ext.isEmpty(legendpanels)) {
            Ext.each(legendpanels, function(legendpanel) {
                legendpanel.close();
            });
        }

        var legendpanel = Ext.create('GeoExt.panel.Legend', {
            filter: function(layerrec) {
                if (Ext.Array.contains(visibleLegends, layerrec)) {
                    return true;
                } else {
                    return false;
                }
            }
        });

        return legendpanel;
    }

});

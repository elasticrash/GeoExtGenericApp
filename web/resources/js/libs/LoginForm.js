/**
 * Created by tougo on 25/10/15.
 */
function OpenLoginForm() {
    var loginstate = true;
    var lform =  new Ext.Window({
        title: 'Login/Register Form',
        bodyPadding: 5,
        defaultType: 'textfield',
        items: [
            {
                fieldLabel: 'Username',
                name: 'username',
                allowBlank: true
            },
            {
                id: 'passbtnid',
                name: 'password',
                inputType: 'password',
                fieldLabel: 'Password',
                allowBlank: false
            },
            {
                id: 'verifybtnid',
                name: 'password',
                inputType: 'password',
                fieldLabel: 'verify Password',
                hidden: true
            }
        ],
        bbar: [
            {
                id: 'enterbtnid',
                xtype: 'button',
                text: "OK",
                margin: 5,
                handler: function () {
                    if(loginstate == false)
                    {
                        var pass = Ext.getCmp('passbtnid').getValue();
                        var vpass = Ext.getCmp('verifybtnid').getValue();
                        if(pass==vpass)
                        {

                        }
                        else
                        {
                            CustomMessage("info", "The Password does not match its verification")
                        }
                    }
                }
            },
            {
                xtype: 'button',
                text: "Register Form",
                margin: 5,
                handler: function () {
                    Ext.getCmp('verifybtnid').show();
                    Ext.getCmp('verifybtnid').allowBlank = false;
                    loginstate = false;
                }
            },
            {
                xtype: 'button',
                text: "Log In Form",
                margin: 5,
                handler: function () {
                    Ext.getCmp('verifybtnid').hide();
                    Ext.getCmp('verifybtnid').allowBlank = true;
                    loginstate = true;
                }
            }
        ]
    });
    lform.show();
}

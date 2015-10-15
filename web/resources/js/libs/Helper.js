function CustomMessage(msgtitle,msg)
{
    Ext.Msg.show({
        title: msgtitle,
        msg: msg,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
    });
}
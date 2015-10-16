/**
 * Created by stefanos on 16/10/2015.
 */
if(language == "en-US")
{
    loadjsfile('resources/js/libs/languages/en-US.js');
}
if(language == "el")
{
    loadjsfile("resources/js/libs/languages/el.js");
}
//if no file language exists it will load english by default
else
{
    loadjsfile('resources/js/libs/languages/en-US.js');
}

function loadjsfile(url){
    Ext.Loader.loadScript({
        url: url,
        scope: this,
        onLoad: function() {
        },
        onError: function() {
        }
    });
}
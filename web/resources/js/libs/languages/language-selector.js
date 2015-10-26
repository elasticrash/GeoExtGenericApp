/**
 * Created by stefanos on 16/10/2015.
 */
var language = window.navigator.userLanguage || window.navigator.language;
function getCookie() {
    var name = "guid=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
(function () {
//dynamically load the browser language if supported synchronously to avoid the application not loading up properly
    function loadScript(url) {
        var xhrObj = createXMLHTTPObject();
        xhrObj.open('GET', url, false);
        xhrObj.send('');
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.text = xhrObj.responseText;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function createXMLHTTPObject() {
        var xmlhttp = false;
        for (var i=0;i<XMLHttpFactories.length;i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }

    var XMLHttpFactories = [
        function () {return new XMLHttpRequest()},
        function () {return new ActiveXObject("Msxml2.XMLHTTP")},
        function () {return new ActiveXObject("Msxml3.XMLHTTP")},
        function () {return new ActiveXObject("Microsoft.XMLHTTP")}
    ];

    var ck = getCookie();
    if(ck == "")
    {
        var xhrObj = createXMLHTTPObject();
        xhrObj.open('GET', "rest/guid/", false);
        xhrObj.send('');
        document.cookie ="guid=" + xhrObj.responseText;
    }

    if(language == "en-US")
    {
        loadScript('resources/js/libs/languages/en-US.js');
    }
    if(language == "el")
    {
        loadScript("resources/js/libs/languages/el.js");
    }
    //if no file language exists it will load english by default
    else
    {
        loadScript('resources/js/libs/languages/en-US.js');
    }


})();
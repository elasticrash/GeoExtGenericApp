/**
 * Created by stefanos on 16/10/2015.
 */
var language = window.navigator.userLanguage || window.navigator.language;

(function () {

    function loadScript(url) {

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                }
            };
        } else { //Others
            script.onload = function () {
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
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
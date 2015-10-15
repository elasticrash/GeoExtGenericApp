# GeoExtGenericApp
A Generic GeoExt2 Client for GeoServer

All you need to do to get it working is 

- changing the Config.js File located at web/js/libs/
- Running it on a Tomcat WebServer (requires a proxy servlet to bypass the cross-origin error of the wfs requests) 
- adding your Geoserver Address to the python proxy


There are obviously, a lot of features that are not working properly.
But the basic concept works. So far the application
- Can load all existing layers from Geoserver
- Select the Geometry of any layer (with the identify button) regardless the name of the Geometry Column (important)
- Display a property grid (with the identify button) but only for the first resulted geometry of the layer
- Displays the Legend
- Go to a pair of Coordinates

# GeoExtGenericApp
####A Generic GeoExt2 Client for GeoServer####

*All you need to do to get it working is:*

1. changing the Config.js File located at web/js/libs/
2. Running it on a Tomcat WebServer (requires a proxy servlet to bypass the cross-origin error of the wfs requests) 
3. adding your Geoserver Address to the python proxy


There are obviously, a lot of features that are not working properly.
*But the basic concept works. So far the application:*
- Can load all existing layers from Geoserver
- Select the Geometry of any layer (with the identify button) regardless the name of the Geometry Column (important)
- Display a property grid (with the identify button) but only for the first resulted geometry of the layer
- Displays the Legend
- Go to a pair of Coordinates
- Query Layers through wfs services
- Automatically detect browser language and display application in the appropriate language if applicable (english being the default)
- Show/Hide Layers
- English and Greek language file (looking for anyone eager to translate to other languages)

*Comming Soon*
- Select features and download them as a Shapefile
- Add/Remove Layers
- A Java BackEnd with SQLite to keep preferences and other stuff
  - Db Created

*Distant Future*
- Search GeonetWork
- Add/Search Metadata from SQLite db

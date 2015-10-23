# GeoExtGenericApp
####A Generic GeoExt2 Client for GeoServer####

*All you need to do to get it working is:*

1. changing the Config.js File located at web/js/libs/
2. Running it on a Tomcat WebServer
3. Proxy servlet to bypass the cross-origin error of the wfs requests needs python (add path to web.xml)
4. Add your Geoserver Address to the python proxy

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
- Stores in Cookie a Guid to identify each client instance
- Spring mvc/rest framework added

*notes*
- index.html changed to index.jsp (no jsp tags though in file) due to the spring mvc transition

*Work on progress*
- A Java BackEnd with SQLite
- Sql Scripts for building the database
  - For the time the database gets deleted on application startup

*Comming Soon*
- Select features and download them as a Shapefile
- Add/Remove Layers

*Distant Future*
- Search GeonetWork
- Add/Search Metadata from SQLite db

[follow me at twitter](http://twitter.com/CodenTonic).

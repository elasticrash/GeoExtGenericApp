# GeoExtGenericApp
####A Generic GeoExt2 Client for GeoServer####

*All you need to do to get it working is:*

1. changing the Config.js File located at web/js/libs/
2. Running it on a Tomcat WebServer
3. Proxy servlet to bypass the cross-origin error of the wfs requests needs python (add path to web.xml)
4. Add your Geoserver Address to the python proxy
5. Create A Schema in PostgreSQL and define its jdbc connection string in PostgreSQLConnector by altering the following line

```c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/GEODB", "postgres", "otinane");```

*notes*
- index.html changed to index.jsp (no jsp tags though in file) due to the spring mvc transition
- PostgreSQL is now part of the application
- Thoughts to switch to Hibernate rather than raw sql
- Thoughts to run a second similar project with OpenLayers3 and no ExtJs or GeoExt at all 

There are obviously, a lot of features that are not working properly.
*But the basic concept works. So far the application:*
- Can load all existing layers from Geoserver
- Select the Geometry of any layer (with the identify button) regardless the name of the Geometry Column (important)
- Display a property grid (with the identify button) but only for the first resulted geometry of the layer
- Displays the Legend
- Go to a pair of Coordinates
- Query Layers through wfs services
- Automatically detect browser language and display application in the appropriate language if applicable (english being the default)
- English and Greek language file (looking for anyone eager to translate to other languages)
- Stores in Cookie a Guid to identify each client instance
- Spring mvc/rest framework added
- Show/Hide Layers (Layer Visibility is stored per user in the database layer)

*Work on progress*
- A Java BackEnd with ~~SQLite~~ PostgreSQL
- Sql Scripts for building the database
- Select Areas and Layers Save them to db and download them later as Shapefiles (almost there still got a couple of bugs)

*Comming Soon*
- Add/Remove Layers

*Distant Future*
- Search GeonetWork
- Choose and Hide Tools
- Add/Search Metadata from ~~SQLite~~  PostgreSQL db

[follow me at twitter](http://twitter.com/CodenTonic).

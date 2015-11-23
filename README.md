# GeoExtGenericApp
####A Generic GeoExt2 Client for GeoServer####

*All you need to do to get it working is:*

1. changing the [Config.js](https://github.com/elasticrash/GeoExtGenericApp/blob/master/web/resources/js/libs/Config.js) File
2. Running it on a Tomcat WebServer
3. Proxy servlet to bypass the cross-origin error of the wfs requests needs python (add path to [web.xml](https://github.com/elasticrash/GeoExtGenericApp/blob/master/web/WEB-INF/web.xml))
4. Add your Geoserver Address to the [python proxy](https://github.com/elasticrash/GeoExtGenericApp/blob/master/web/WEB-INF/cgi/proxy.cgi)
5. Create A Schema in PostgreSQL and define its jdbc connection string in [PostgreSQLConnector](https://github.com/elasticrash/GeoExtGenericApp/blob/master/src/main/java/PostgreSQL/PostgreSQLConnector.java) by altering the following line

```c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/GEODB", "postgres", "otinane");```

*notes*
- Feature Editing works (insert and update) there is a bug with labeling the new features. Editing in the web is a bit complex so I have to post instructions on how the whole concept works. No attribure editing atm.
- index.html changed to [index.jsp](https://github.com/elasticrash/GeoExtGenericApp/blob/master/web/WEB-INF/index.jsp) (no jsp tags though in file) due to the spring mvc transition
- PostgreSQL is now part of the application
- Thoughts to switch to Hibernate rather than raw sql
- Thoughts to run a second similar project with OpenLayers3 and no ExtJs or GeoExt at all 
- Some tools may require some Geoserver Plugins (like printing)

Application Capabilities
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
- Select Areas and Layers Save them to db and download them later as Shapefiles
- Choose and Hide Tools
- [Feature Editing](https://github.com/elasticrash/GeoExtGenericApp/wiki/Editing) Needs Improvements but it works.

*Work on progress*
- A more complete Java BackEnd
- Sql Scripts for building the database
- Attribute Editing

*Comming Soon*
- Add/Search Metadata

*Distant Future*
- Search GeonetWork
- Networks
- Topology

[follow me at twitter](http://twitter.com/CodenTonic) and ask me anything.

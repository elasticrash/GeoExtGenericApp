package SQLite;

import java.io.File;
import java.sql.*;

/**
 * Created by tougo on 18/10/15.
 */
public class SQLiteConnector {
    public static void CreateSchema()
    {
        File f = new File("Geodb.db");
        f.delete();
        Connection c = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            c = Connector();
            stmt = c.createStatement();
            String sql = "CREATE TABLE if not exists LAYERS " +
                    "(ID INTEGER PRIMARY KEY," +
                    " NAME TEXT, " +
                    " NS TEXT, " +
                    " ADDRESS TEXT, " +
                    " SRS TEXT," +
                    " VISIBLE INTEGER, "+
                    " USERID TEXT)";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
            System.out.println("table created successfully");
            System.out.println(sql);
        } catch ( Exception e ) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
            System.exit(0);
        }
        System.out.println("Opened database successfully");
    }
    public static Connection Connector() {
        Connection c = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            c = DriverManager.getConnection("jdbc:sqlite:Geodb.db");
            return c;
        } catch (Exception e) {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        return null;
    }
}

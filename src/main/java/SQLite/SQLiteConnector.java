package SQLite;

import java.sql.*;

/**
 * Created by tougo on 18/10/15.
 */
public class SQLiteConnector {
    public static void CreateSchema()
    {
        Connection c = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            c = Connector();
            stmt = c.createStatement();
            String sql = "CREATE TABLE if not exists LAYERS " +
                    "(ID INT PRIMARY KEY     NOT NULL," +
                    " NAME           TEXT    NOT NULL, " +
                    " NS            INT     NOT NULL, " +
                    " ADDRESS        CHAR(50), " +
                    " SRS         CHAR(50)," +
                    " VISIBLE         INTEGER)";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
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
            c = DriverManager.getConnection("jdbc:sqlite:GeoApp.db");
            return c;
        } catch (Exception e) {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        return null;
    }
}

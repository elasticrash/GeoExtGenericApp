package SQLite;

import java.io.File;
import java.sql.*;

/**
 * Created by tougo on 18/10/15.
 */
public class PostgreSQLConnector {
    public static void CreateSchema()
    {
        Connection c = null;
        Statement stmt = null;
        try {
            c = Connector();
            stmt = c.createStatement();
            String sql = "CREATE TABLE if not exists LAYERS " +
                    "(ID serial primary key," +
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
    }
    public static Connection Connector() {
        Connection c = null;
        Statement stmt = null;
        try {
            DriverManager.registerDriver(new org.postgresql.Driver());
            c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/GEODB", "postgres", "otinane");
            return c;
        } catch (Exception e) {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        return null;
    }

//    public static void CreateSchema()
//    {
//        Statement stmt;
//        Connection c = PostgreSQLConnector.Connector();
//        try {
//            String strI = "";
//            stmt = c.createStatement();
//
//            String sql = "CREATE SCHEMA IF NOT EXISTS GEODB";
//            stmt.executeQuery(sql);
//                       stmt.close();
//            c.close();
//            System.out.println("Schema Created");
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//    }
}

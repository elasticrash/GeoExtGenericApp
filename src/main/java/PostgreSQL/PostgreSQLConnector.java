package PostgreSQL;

import java.sql.*;

/**
 * Created by tougo on 18/10/15.
 */
public class PostgreSQLConnector {
    public static void CreateSchema()
    {
        //To Re-Initialise the schema (in case i introduce changes)
        //DropAllTables();
        CreateLayers();
        CreateUsers();
        CreateControlAreas();
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

    public static void CreateLayers()
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
            System.out.println("table layers created successfully");
            System.out.println(sql);
        } catch ( Exception e ) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
            System.exit(0);
        }
    }

    public static void CreateUsers()
    {
        Connection c = null;
        Statement stmt = null;
        try {
            c = Connector();
            stmt = c.createStatement();
            String sql = "CREATE TABLE if not exists USERS " +
                    "(ID serial primary key," +
                    " USERNAME TEXT, " +
                    " PASSWORD TEXT)";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
            System.out.println("table layers created successfully");
            System.out.println(sql);
        } catch ( Exception e ) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
            System.exit(0);
        }
    }

    public static void CreateControlAreas()
    {
        Connection c = null;
        Statement stmt = null;
        try {
        c = Connector();
        stmt = c.createStatement();
        String sql = "CREATE TABLE if not exists CONTROL_AREAS" +
                "(ID serial primary key," +
                "FILTER TEXT," +
                "REQUEST TEXT," +
                "DESCRIPTION TEXT)";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
            System.out.println("table layers created successfully");
            System.out.println(sql);
        } catch ( Exception e ) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
            System.exit(0);
        }
    }


    public static void DropAllTables()
    {
        Connection c = null;
        Statement stmt = null;
        try {
            c = Connector();
            stmt = c.createStatement();
            String sql = "DROP TABLE LAYERS,CONTROL_AREAS,USERS";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
            System.out.println("tables drop successfully");
            System.out.println(sql);
        } catch ( Exception e ) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
            System.exit(0);
        }
    }
}

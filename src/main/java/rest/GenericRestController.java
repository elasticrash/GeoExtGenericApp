package rest;


import DTO.DBLayer;
import SQLite.PostgreSQLConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.UUID;

@Controller
@RequestMapping("/rest")
public class GenericRestController {
    @Autowired
    @RequestMapping(value = "/layers", method = RequestMethod.GET)
    public @ResponseBody
    String layers() {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            String strI = "";
            stmt = c.createStatement();
        String sql = "SELECT COUNT(*) from LAYERS";
            ResultSet rs =stmt.executeQuery(sql);
            while ( rs.next() ) {
                int count = rs.getInt("count");
                StringBuilder sb = new StringBuilder();
                sb.append(count);
                strI = sb.toString();
                System.out.println("Number of records in layers "+strI);
            }
            rs.close();
            stmt.close();
            c.close();
            return strI;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "ERROR";
    }

    @RequestMapping(value = "/addlayer", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    String addlayer(@RequestBody DBLayer dbl) {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            stmt = c.createStatement();

            String sql = "INSERT INTO LAYERS (NAME, NS, ADDRESS, SRS, VISIBLE, USERID) VALUES('"+dbl.getName()+"','"+dbl.getNs() +"','"+dbl.getAddress()+"','"+dbl.getSrs()+ "'," +dbl.getVisible() +",'"+ dbl.getUserid()+"')";
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
            System.out.println(sql);

            return "SUCCESS";
        } catch (SQLException e) {
            e.printStackTrace();
            return "FAIL";
        }
    }

    @RequestMapping(value = "/updatelayer", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    String updatelayer(@RequestBody DBLayer dbl) {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            stmt = c.createStatement();

            String sql = "UPDATE INTO LAYERS SET NAME ="+dbl.getName()+",NS="+dbl.getNs()+",ADDRESS="+dbl.getAddress()+
                    ",SRS="+ dbl.getSrs()+",VISIBLE="+dbl.getVisible()+",USERID="+ dbl.getUserid() + "WHERE NAME="+dbl.getName()+" AND USERID="+dbl.getUserid();
            stmt.executeUpdate(sql);
            stmt.close();
            c.close();
            System.out.println(sql);

            return "SUCCESS";
        } catch (SQLException e) {
            e.printStackTrace();
            return "FAIL";
        }
    }

    @RequestMapping(value = "/guid", method = RequestMethod.GET)
    public @ResponseBody
    String GUID() {
        DecimalFormat timeFormat4 = new DecimalFormat("0000;0000");
        
        Calendar cal = Calendar.getInstance();
        String val = String.valueOf(cal.get(Calendar.YEAR));
        val += timeFormat4.format(cal.get(Calendar.DAY_OF_YEAR));
        val += UUID.randomUUID().toString().replaceAll("-", "");
        return val;
    }

    @RequestMapping(value = "/IdExists", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DBLayer IdExists(@RequestBody DBLayer dbl) {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            stmt = c.createStatement();
            String sql = "SELECT COUNT(*) from LAYERS WHERE USERID='"+dbl.getUserid()+"' AND NAME="+"'"+dbl.getName()+"'";
            ResultSet rs =stmt.executeQuery(sql);
            while ( rs.next() ) {
                int count = rs.getInt("count");
                dbl.setElementCount(count);
            }
            rs.close();
            stmt.close();
            c.close();
            System.out.println("User Has stored  "+ dbl.getElementCount() + " instance of this Layers");
            return dbl;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
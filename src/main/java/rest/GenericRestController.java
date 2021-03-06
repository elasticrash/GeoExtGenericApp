package rest;


import DTO.ControlArea;
import DTO.Layer;
import PostgreSQL.PostgreSQLConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.util.*;

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
    String addlayer(@RequestBody Layer dbl) {
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
    String updatelayer(@RequestBody Layer dbl) {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            stmt = c.createStatement();

            String sql = "UPDATE LAYERS SET NAME ='"+dbl.getName()+"',NS='"+dbl.getNs()+"',ADDRESS='"+dbl.getAddress()+
                    "',SRS='"+ dbl.getSrs()+"',VISIBLE="+dbl.getVisible()+",USERID='"+ dbl.getUserid() + "' WHERE NAME='"+dbl.getName()+"' AND USERID='"+dbl.getUserid()+"'";
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
    Layer IdExists(@RequestBody Layer dbl) {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            stmt = c.createStatement();
            String sql = "SELECT visible from LAYERS WHERE USERID='"+dbl.getUserid()+"' AND NAME="+"'"+dbl.getName()+"'";
            ResultSet rs =stmt.executeQuery(sql);
            int count = 0;
            while ( rs.next() ) {
                count++;
                int visible = rs.getInt("visible");
                dbl.setVisible(visible);
            }
            dbl.setElementCount(count);

            rs.close();
            stmt.close();
            c.close();
            System.out.println("User Has stored  "+ dbl.getElementCount() + " instance of this Layers: "+ dbl.getName());
            return dbl;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/addControlArea", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    String addControlArea(@RequestBody ControlArea dbl) {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            stmt = c.createStatement();

            String sql = "INSERT INTO CONTROL_AREAS (FILTER, REQUEST, DESCRIPTION) VALUES('"+dbl.getFilter()+"','"+dbl.getRequest() +"','"+dbl.getDescription()+"')";
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

    @RequestMapping(value = "/getControlAreas", method = RequestMethod.GET)
    public @ResponseBody
    List<ControlArea> getControlAreas() {
        Statement stmt;
        Connection c = PostgreSQLConnector.Connector();
        try {
            List<ControlArea> lca = new ArrayList<ControlArea>();

            stmt = c.createStatement();
            String sql = "SELECT * from CONTROL_AREAS";
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                ControlArea ca = new ControlArea();
                String FILTER = rs.getString("filter");
                String REQUEST = rs.getString("request");
                String DESCRIPTION = rs.getString("description");
                ca.setFilter(FILTER);
                ca.setRequest(REQUEST);
                ca.setDescription(DESCRIPTION);
                lca.add(ca);
            }
            rs.close();
            stmt.close();
            c.close();
            return lca;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
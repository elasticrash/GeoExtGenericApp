package rest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import SQLite.SQLiteConnector;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@Controller
@RequestMapping("/rest")
public class GenericRestController {
    @Autowired
    @RequestMapping(value = "/layers", method = RequestMethod.GET)
    public @ResponseBody
    String layers() {
        //SQLiteConnector.CreateSchema();
        Statement stmt = null;
        Connection c = SQLiteConnector.Connector();
        try {
            stmt = c.createStatement();

        String sql = "SELECT COUNT(*) from LAYERS";
            ResultSet rs =stmt.executeQuery(sql);
            while ( rs.next() ) {
                int count = rs.getInt("COUNT(*)");
                StringBuilder sb = new StringBuilder();
                sb.append(count);
                String strI = sb.toString();
              return strI;
            }
            rs.close();
            stmt.close();
            c.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "X";
    }
}
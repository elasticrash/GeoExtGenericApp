package DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Created by tougo on 23/10/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DBLayer {
    @JsonIgnore
    public Integer id;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String Name;
    public String getName() {
        return Name;
    }
    public void setName(String Name) {
        this.Name = Name;
    }
    public String Ns;
    public String getNs() {return Ns;}
    public void setNs(String Ns) {
        this.Ns = Ns;
    }
    public String Address;
    public String getAddress() {
        return Address;
    }
    public void setAddress(String Address) {
        this.Address = Address;
    }
    public Integer Visible;
    public Integer getVisible() {
        return Visible;
    }
    public void setVisible(Integer Visible) {this.Visible = Visible;}
    public String Srs;
    public String getSrs() {
        return Srs;
    }
    public void setSrs(String Srs) {
        this.Srs = Srs;
    }
    public String Userid;
    public String getUserid() {
        return Userid;
    }
    public void setUserid(String Userid) {
        this.Userid = Userid;
    }
    public Integer ElementCount;
    public Integer getElementCount() {
        return ElementCount;
    }
    public void setElementCount(Integer ElementCount) {
        this.ElementCount = ElementCount;
    }
}

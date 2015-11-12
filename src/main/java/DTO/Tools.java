package DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Created by stefanos on 12/11/2015.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Tools {
    @JsonIgnore
    public Integer id;
    public int getId() {return id;}
    public void setId(int id) {this.id = id;}
    public String Name;
    public String getName() {
        return Name;
    }
    public void setName(String Name) {
        this.Name = Name;
    }
    public Integer Visible;
    public Integer getVisible() {
        return Visible;
    }
    public void setVisible(Integer Visible) {this.Visible = Visible;}
    public String Userid;
    public String getUserid() {return Userid;}
    public void setUserid(String Userid) {this.Userid = Userid;}
}

package DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Created by tougo on 5/11/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)

public class ControlArea {
    @JsonIgnore
    public Integer id;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String Filter;
    public String getFilter() {
        return Filter;
    }
    public void setFilter(String Filter) {
        this.Filter = Filter;
    }
    public String Request;
    public String getRequest() {
        return Request;
    }
    public void setRequest(String Request) {
        this.Request = Request;
    }
    public String Description;
    public String getDescription() {
        return Description;
    }
    public void setDescription(String Description) {
        this.Description = Description;
    }
}

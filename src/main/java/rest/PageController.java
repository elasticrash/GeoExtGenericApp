package rest;

/**
 * Created by tougo on 18/10/15.
 */
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/")
public class PageController {
    @RequestMapping(value = "/")
    public String Sroot(ModelMap model) {
        model.addAttribute("message", "Hello world!");
        return "index";
    }
}
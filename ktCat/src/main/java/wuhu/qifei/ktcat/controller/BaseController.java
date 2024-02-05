package wuhu.qifei.ktcat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class BaseController {

    @RequestMapping("/index")
    public String method1() throws Exception {

        return "index";
    }

    public static void main(String[] args) {
        boolean isPossible = true;
        行不行(isPossible);
    }

    public static void 行不行(boolean isPossible){
        if(isPossible) {
            System.out.println("一定行");
        } else {
            System.out.println("不行");
        }
    }

}

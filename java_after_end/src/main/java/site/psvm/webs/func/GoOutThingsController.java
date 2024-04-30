package site.psvm.webs.func;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.psvm.webs.base.BaseController;
import site.psvm.webs.resp.Resp;

/**
 * 出门备忘清单
 *
 * @author LeeYiuTing
 */

@RestController
@RequestMapping("/goOut")
public class GoOutThingsController extends BaseController {


    // 获取出门备忘清单
    @PostMapping("/getMyGoOutThings")
    public Resp<String> getGoOutList() {

        return packResp("001", "成功", "success");
    }

    @GetMapping("/test")
    public String test1(){
        System.out.println("test");
        return "1";
    }

    // 新增备忘
    public void addGoOut() {
        // TODO
    }

    // 删除备忘
    public void deleteGoOut() {
        // TODO
    }

    // 修改备忘
    public void updateGoOut() {
        // TODO
    }
}

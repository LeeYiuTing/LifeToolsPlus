package wuhu.qifei.ktcat.webs.func;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wuhu.qifei.ktcat.webs.base.BaseController;
import wuhu.qifei.ktcat.webs.resp.Resp;

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
        int a = 1/0;
       return null;
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

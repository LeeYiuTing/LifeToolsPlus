package wuhu.qifei.ktcat.webs.func;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RestController;
import wuhu.qifei.ktcat.webs.base.BaseController;

/**
 * 出门备忘清单
 * @author LeeYiuTing
 */

@RestController("/goOut")
public class GoOutController extends BaseController {

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public GoOutController(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

        // 获取出门备忘清单
        public void getGoOutList() {
            // TODO
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

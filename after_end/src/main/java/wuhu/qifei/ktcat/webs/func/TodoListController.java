package wuhu.qifei.ktcat.webs.func;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wuhu.qifei.ktcat.pojo.Task;
import wuhu.qifei.ktcat.common.enumType.RedisConstant;
import wuhu.qifei.ktcat.webs.resp.Resp;
import wuhu.qifei.ktcat.webs.base.BaseController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static wuhu.qifei.ktcat.common.util.GsonUtils.JSON_TO_OBJ;

/**
 * TodoList
 * 待办事项的控制器
 */
@RestController
@RequestMapping("/todolist")
public class TodoListController extends BaseController {
    private final StringRedisTemplate redisTemplate;

    @Autowired
    public TodoListController(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }


    // 获取任务列表
    @RequestMapping("/list")
    public Resp<List<Task>> queryTask(){
        BoundHashOperations<String, String, String> boundHashOps = redisTemplate.boundHashOps(RedisConstant.TASK_MAP.getKey());
        List<String> values = boundHashOps.values();
        if (CollectionUtils.isEmpty(values)) return packResp("200","没有任务",null);
        ArrayList<Task> tasks = new ArrayList<>();
        for (String value : values) {
            tasks.add(JSON_TO_OBJ(value, Task.class));
        }
        tasks.sort(Comparator.comparing(Task::getCreateTime));
        return packResp("200","查询成功",tasks);
    }

    // 新增task
    @RequestMapping("/add")
    public Resp<String> addTask(@RequestBody Task task){
        BoundHashOperations<String, String, String> boundHashOps = redisTemplate.boundHashOps(RedisConstant.TASK_MAP.getKey());
        task.setUniqueCode(UUID.randomUUID().toString());
        task.setCreateTime(System.currentTimeMillis());
        task.setUpdateTime(task.getCreateTime());
        task.setStatus(10);
        boundHashOps.put(task.getUniqueCode(), new Gson().toJson(task));
        return packResp("200","新增成功",task.getUniqueCode());
    }

    // 完成task
    @RequestMapping("/finish")
    public Resp<String> finishTask(@RequestBody Task task){
        BoundHashOperations<String, String, String> boundHashOps = redisTemplate.boundHashOps(RedisConstant.TASK_MAP.getKey());
        String jsonStr = boundHashOps.get(task.getUniqueCode());
        Task task1 = JSON_TO_OBJ(jsonStr, Task.class);
        task1.setStatus(task.getStatus());
        task1.setUpdateTime(System.currentTimeMillis());
        boundHashOps.put(task.getUniqueCode(), new Gson().toJson(task1));
        return packResp("200","成功",task.getUniqueCode());
    }

    // 删除task
    @RequestMapping("/delete")
    public Resp<String> deleteTask(@RequestBody Task task){
        BoundHashOperations<String, String, String> boundHashOps = redisTemplate.boundHashOps(RedisConstant.TASK_MAP.getKey());
        boundHashOps.delete(task.getUniqueCode());
        return packResp("200","成功",task.getUniqueCode());
    }
}

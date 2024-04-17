package wuhu.qifei.ktcat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import wuhu.qifei.ktcat.pojo.Task;
import wuhu.qifei.ktcat.common.enumType.RedisConstant;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static wuhu.qifei.ktcat.common.util.GsonUtils.OBJ_TO_JSON;
import static wuhu.qifei.ktcat.common.util.GsonUtils.JSON_TO_OBJ;

@Component
public class SchedulingService {


    private final StringRedisTemplate redisTemplate;

    @Autowired
    public SchedulingService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 清理&延续任务
     * 零点一分执行
     */
    @Scheduled(cron = "0 1 0 * * ?")
    public void analyze() {
        BoundHashOperations<String, String, String> boundHashOps = redisTemplate.boundHashOps(RedisConstant.TASK_MAP.getKey());
        List<String> values = boundHashOps.values();
        // taskList is empty
        if (CollectionUtils.isEmpty(values)) return;

        List<Task> tasks = new ArrayList<>();
        for (String value : values) {
            tasks.add(JSON_TO_OBJ(value, Task.class));
        }

        //delete taskMap
        redisTemplate.delete(RedisConstant.TASK_MAP.getKey());

        //update taskList
        Map<String, Task> collect = tasks.stream().filter(task -> task.getStatus() == 10 || (null != task.getTaskType() && task.getTaskType() == 2)).collect(Collectors.toMap(Task::getUniqueCode, Function.identity()));
        collect.forEach((k, v) -> {
            v.setStatus(10);
            v.setUpdateTime(v.getCreateTime());
            boundHashOps.put(k, OBJ_TO_JSON(v));
        });
    }
}

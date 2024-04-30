package site.psvm.service.Scheduling;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import site.psvm.common.enumType.RedisConstant;
import site.psvm.common.util.ImageUtil;
import site.psvm.entity.ResourceFile;
import site.psvm.entity.Task;
import site.psvm.service.impl.ResourceFileServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static site.psvm.common.util.GsonUtils.OBJ_TO_JSON;
import static site.psvm.common.util.GsonUtils.JSON_TO_OBJ;

@Component
public class SchedulingService {


    private final StringRedisTemplate redisTemplate;
    private final ResourceFileServiceImpl resourceFileServiceImpl;
    private final ImageUtil imageUtil;

    @Autowired
    public SchedulingService(StringRedisTemplate redisTemplate, ResourceFileServiceImpl resourceFileServiceImpl, ImageUtil imageUtil) {
        this.redisTemplate = redisTemplate;
        this.resourceFileServiceImpl = resourceFileServiceImpl;
        this.imageUtil = imageUtil;
    }

    //每隔两秒执行
    @Scheduled(cron = "0/2 * * * * ?")
    public void procImage() {
        String fileName = redisTemplate.opsForList().leftPop(RedisConstant.IMAGE_PROC_QUEUE.getKey());
        if (null != fileName) {
            imageUtil.compressImage(fileName);
            //更新记录
            LambdaUpdateWrapper<ResourceFile> wrapper = new LambdaUpdateWrapper<>();
            //fileName去后缀
            var uniqueCode = fileName.substring(0, fileName.lastIndexOf("."));
            wrapper.eq(ResourceFile::getUniqueCode, uniqueCode).set(ResourceFile::getDealStatus, 2);
            boolean update = resourceFileServiceImpl.update(wrapper);
            System.out.println("更新记录" + update);
        }
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

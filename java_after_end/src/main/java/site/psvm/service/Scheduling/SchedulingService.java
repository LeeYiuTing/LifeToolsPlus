package site.psvm.service.Scheduling;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import site.psvm.beans.entity.Tag;
import site.psvm.common.enumType.RedisConstant;
import site.psvm.common.util.DateTimeUtils;
import site.psvm.common.util.ImageBusiness;
import site.psvm.beans.entity.ResourceFile;
import site.psvm.beans.entity.Task;
import site.psvm.service.impl.ResourceFileServiceImpl;
import site.psvm.service.impl.TagServiceImpl;

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
    private final ImageBusiness imageBusiness;
    private final TagServiceImpl tagServiceImpl;

    @Autowired
    public SchedulingService(StringRedisTemplate redisTemplate, ResourceFileServiceImpl resourceFileServiceImpl, ImageBusiness imageBusiness, TagServiceImpl tagServiceImpl) {
        this.redisTemplate = redisTemplate;
        this.resourceFileServiceImpl = resourceFileServiceImpl;
        this.imageBusiness = imageBusiness;
        this.tagServiceImpl = tagServiceImpl;
    }

    /**
     * 处理图像压缩任务, 每2s执行一次
     */
    @Scheduled(cron = "0/2 * * * * ?")
    public void procImage() {
        String fileName = redisTemplate.opsForList().leftPop(RedisConstant.IMAGE_PROC_QUEUE.getKey());
        if (null != fileName) {
            imageBusiness.compressImage(fileName);
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
     * 处理昨日标签
     */
    @Scheduled(cron = "* * 1 * * ?")
    public void processYesterdayTag() {
        String yesterdayRedisKey = RedisConstant.Today_Tags.getKey()+ DateTimeUtils.getToday(-1);
        String todayRedisKey = RedisConstant.Today_Tags.getKey()+ DateTimeUtils.getToday(0);
        BoundHashOperations<String, Object, Object> obh = redisTemplate.boundHashOps(yesterdayRedisKey);
        Map<Object, Object> entries = obh.entries();
        if (entries != null) {
            entries.forEach((k, v) -> {
                String tagName = k.toString();
                int count = Integer.parseInt(v.toString());
                if (count > 0) {
                    LambdaUpdateWrapper<Tag> luw = new LambdaUpdateWrapper<>();
                    luw.eq(Tag::getTag, tagName);
                    luw.setSql("hot_count = hot_count + ?",count);
                    tagServiceImpl.update(luw);
                }
            });
        }
        redisTemplate.delete(yesterdayRedisKey);

        //取十个最热门的标签, 放入redis
        IPage<Tag> tagIPage = new Page<>(1, 10);
        LambdaQueryWrapper<Tag> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Tag::getStatus, 10);
        lqw.orderByDesc(Tag::getHotCount);
        List<Tag> list = tagServiceImpl.list(tagIPage, lqw);
        if (!CollectionUtils.isEmpty(list)){
            list.forEach(tag -> {
                String tagName = tag.getTag();
                redisTemplate.opsForHash().put(todayRedisKey, tagName, 0);
            });
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

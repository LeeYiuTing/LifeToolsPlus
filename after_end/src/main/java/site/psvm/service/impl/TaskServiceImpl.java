package site.psvm.service.impl;

import site.psvm.pojo.Task;
import site.psvm.mapper.TaskMapper;
import site.psvm.service.ITaskService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-04-18
 */
@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements ITaskService {

}

package site.psvm.service.impl;

import site.psvm.beans.entity.Tag;
import site.psvm.mapper.TagMapper;
import site.psvm.service.ITagService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-05-08
 */
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements ITagService {

}

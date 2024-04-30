package site.psvm.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.BeanUtils;
import site.psvm.dto.FileDto;
import site.psvm.dto.ResourceFileDto;
import site.psvm.entity.ResourceFile;
import site.psvm.mapper.ResourceFileMapper;
import site.psvm.service.IResourceFileService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static site.psvm.common.util.GsonUtils.JSON_TO_OBJ;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-04-29
 */
@Service
public class ResourceFileServiceImpl extends ServiceImpl<ResourceFileMapper, ResourceFile> implements IResourceFileService {

    @Override
    public List<ResourceFileDto> getImageList(int pageNo, int pageSize) {
        List<ResourceFileDto> result = new ArrayList<>();
        Page<ResourceFile> pageHelp = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<ResourceFile> lqw = new LambdaQueryWrapper<>();
        lqw.eq(ResourceFile::getDealStatus, 2);
        lqw.eq(ResourceFile::getFileType, 1);
        lqw.eq(ResourceFile::getStatus,10);
        lqw.orderByDesc(ResourceFile::getCreateTime);
        List<ResourceFile> list = list(pageHelp, lqw);
        if (!list.isEmpty()) {
            for (ResourceFile resourceFile : list) {
                ResourceFileDto dto = new ResourceFileDto();
                BeanUtils.copyProperties(resourceFile, dto,"file");
                dto.setFile(JSON_TO_OBJ(resourceFile.getFile(), FileDto.class));
                result.add(dto);
            }
            return result;
        }
        return List.of();
    }
}

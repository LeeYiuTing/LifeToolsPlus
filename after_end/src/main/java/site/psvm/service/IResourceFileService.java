package site.psvm.service;

import site.psvm.dto.ResourceFileDto;
import site.psvm.entity.ResourceFile;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-04-29
 */
public interface IResourceFileService extends IService<ResourceFile> {

    /**
     * 获取图片列表
     * @param pageNo
     * @param pageSize
     * @return
     */
    List<ResourceFileDto> getImageList(int pageNo, int pageSize);
}

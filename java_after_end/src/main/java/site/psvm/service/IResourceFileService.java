package site.psvm.service;

import org.springframework.web.multipart.MultipartFile;
import site.psvm.beans.dto.ListDto;
import site.psvm.beans.dto.ObjectDto;
import site.psvm.beans.dto.ResourceFileDto;
import site.psvm.beans.entity.ResourceFile;
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

    ListDto<ResourceFileDto> getImageListForEs(int pageNo, int pageSize, String tagKeyword);

    /**
     * 保存图片
     *
     * @param file
     * @param tags
     * @return
     */
    ObjectDto<Void> saveFile(MultipartFile file, List<String> tags);
}

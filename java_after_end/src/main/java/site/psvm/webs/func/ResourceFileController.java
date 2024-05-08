package site.psvm.webs.func;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import site.psvm.beans.dto.ListDto;
import site.psvm.beans.dto.ObjectDto;
import site.psvm.beans.dto.ResourceFileDto;
import site.psvm.service.IResourceFileService;
import site.psvm.webs.base.BaseController;
import site.psvm.webs.resp.Resp;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-04-29
 */
@RestController
@RequestMapping("/resourceFile")
public class ResourceFileController extends BaseController {


    private final StringRedisTemplate redisTemplate;

    private final IResourceFileService resourceFileService;

    @Autowired
    public ResourceFileController(StringRedisTemplate redisTemplate, IResourceFileService resourceFileService) {
        this.redisTemplate = redisTemplate;
        this.resourceFileService = resourceFileService;
    }

    /**
     * 上传文件
     * @param file
     * @param tags
     * @return
     * @throws IOException
     */
    @RequestMapping("/add")
    public Resp<Void> addResourceFile(@RequestParam("file") MultipartFile file,@RequestParam(value = "tags",required = false) List<String> tags) throws IOException {
        if (!file.isEmpty()) {
            ObjectDto<Void> result = resourceFileService.saveFile(file, tags);
            return packResp(result.getCode(), result.getMsg(), null);
        } else {
            return packResp("201", "你没有上传图片", null);
        }
    }

    /**
     * 图片列表
     */
    @RequestMapping("/list")
    public Resp<List<ResourceFileDto>> getResourceFileList() {
        ListDto<ResourceFileDto> imageListForEs = resourceFileService.getImageListForEs(1, 20, null);
        return packResp("200", "success", imageListForEs.getData());
    }

    /**
     * 图片搜索
     * @param params
     * @return
     */
    @RequestMapping("/search")
    public Resp<List<ResourceFileDto>> search(@RequestBody Map<String,String> params) {
        String keyword = params.get("keyword");
        ListDto<ResourceFileDto> imageListForEs = resourceFileService.getImageListForEs(1, 20, keyword);
        return packResp("200", "success", imageListForEs.getData());
    }



}

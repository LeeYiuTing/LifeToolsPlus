package site.psvm.webs.func;

import cn.hutool.core.lang.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import site.psvm.bootStart.StaticPathConfig;
import site.psvm.common.enumType.RedisConstant;
import site.psvm.common.util.ImageUtil;
import site.psvm.dto.FileDto;
import site.psvm.dto.ResourceFileDto;
import site.psvm.entity.ResourceFile;
import site.psvm.service.IResourceFileService;
import site.psvm.webs.base.BaseController;
import site.psvm.webs.resp.Resp;

import java.io.IOException;
import java.util.List;

import static site.psvm.common.util.GsonUtils.OBJ_TO_JSON;

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
    private final StaticPathConfig staticPathConfig;
    private final ImageUtil imageUtil;

    @Autowired
    public ResourceFileController(StringRedisTemplate redisTemplate, IResourceFileService resourceFileService, StaticPathConfig staticPathConfig, ImageUtil imageUtil) {
        this.redisTemplate = redisTemplate;
        this.resourceFileService = resourceFileService;
        this.staticPathConfig = staticPathConfig;
        this.imageUtil = imageUtil;
    }

    /**
     * 上传文件
     * @param file
     * @param tags
     * @return
     * @throws IOException
     */
    @RequestMapping("/add")
    public Resp<Void> addResourceFile(@RequestParam("file") MultipartFile file,@RequestParam(value = "tags",required = false) String[] tags) throws IOException {
        if (!file.isEmpty()) {
            FileDto fileDto = new FileDto();
            String uuid = UUID.fastUUID().toString();
            String originalFilename = file.getOriginalFilename();
            //获取文件后缀
            String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
            var fileName = uuid+suffix;
            fileDto.setFileName(fileName);

            fileDto.setUrl(staticPathConfig.getOriginal()+fileName);
            fileDto.setPreviewUrl(staticPathConfig.getCompressed()+fileName);

            imageUtil.saveImage(fileName, file.getInputStream());
            this.addImageProcQueen(fileName);

            ResourceFile resourceFile = new ResourceFile();
            resourceFile.setUniqueCode(uuid);
            resourceFile.setName(fileName);
            resourceFile.setFile(OBJ_TO_JSON(fileDto));
            resourceFile.setFileType(1);
            resourceFile.setStatus(10);
            if (tags!=null){
                resourceFile.setTags(OBJ_TO_JSON(tags));
            }
            resourceFile.setDealStatus(0);
            resourceFile.setCreateTime(System.currentTimeMillis());
            resourceFileService.save(resourceFile);
            return packResp("200", "success", null);
        } else {
            return packResp("201", "你没有上传图片", null);
        }
    }

    /**
     * 图片列表
     */
    @RequestMapping("/list")
    public Resp<List<ResourceFileDto>> getResourceFileList() {
        return packResp("200", "success", resourceFileService.getImageList(1,20));
    }

    /**
     * 添加图片处理队列
     * @param originalFilename 文件名
     */
    private void addImageProcQueen(String originalFilename) {

        redisTemplate.opsForList().rightPush(RedisConstant.IMAGE_PROC_QUEUE.getKey(), originalFilename);
    }


}

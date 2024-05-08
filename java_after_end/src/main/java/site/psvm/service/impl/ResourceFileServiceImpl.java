package site.psvm.service.impl;

import cn.hutool.core.lang.UUID;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.multipart.MultipartFile;
import site.psvm.beans.EsDoc.ResourceFileDoc;
import site.psvm.beans.dto.*;
import site.psvm.beans.entity.Tag;
import site.psvm.common.enumType.RedisConstant;
import site.psvm.common.util.DateTimeUtils;
import site.psvm.configuration.StaticPathConfig;
import site.psvm.common.util.ImageBusiness;
import site.psvm.beans.entity.ResourceFile;
import site.psvm.mapper.ResourceFileMapper;
import site.psvm.mapper.TagMapper;
import site.psvm.service.IResourceFileService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import site.psvm.service.elastic.ElasticService;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static site.psvm.common.util.GsonUtils.JSON_TO_OBJ;
import static site.psvm.common.util.GsonUtils.OBJ_TO_JSON;

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

    private final StaticPathConfig staticPathConfig;
    private final ImageBusiness imageBusiness;
    private final ElasticService elasticService;
    private final StringRedisTemplate redisTemplate;
    private final TagMapper tagMapper;

    @Autowired
    public ResourceFileServiceImpl(StaticPathConfig staticPathConfig, ImageBusiness imageBusiness, ElasticService elasticService, StringRedisTemplate stringRedisTemplate, TagMapper tagMapper) {
        this.staticPathConfig = staticPathConfig;
        this.imageBusiness = imageBusiness;
        this.elasticService = elasticService;
        this.redisTemplate = stringRedisTemplate;
        this.tagMapper = tagMapper;
    }


    @Override
    public List<ResourceFileDto> getImageList(int pageNo, int pageSize) {
        List<ResourceFileDto> result = new ArrayList<>();
        Page<ResourceFile> pageHelp = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<ResourceFile> lqw = new LambdaQueryWrapper<>();
        lqw.eq(ResourceFile::getDealStatus, 2);
        lqw.eq(ResourceFile::getFileType, 1);
        lqw.eq(ResourceFile::getStatus, 10);
        lqw.orderByDesc(ResourceFile::getCreateTime);
        List<ResourceFile> list = list(pageHelp, lqw);
        if (!list.isEmpty()) {
            for (ResourceFile resourceFile : list) {
                ResourceFileDto dto = new ResourceFileDto();
                BeanUtils.copyProperties(resourceFile, dto, "file");
                dto.setFile(JSON_TO_OBJ(resourceFile.getFile(), FileDto.class));
                result.add(dto);
            }
            return result;
        }
        return List.of();
    }

    @Override
    public ListDto<ResourceFileDto> getImageListForEs(int pageNo, int pageSize, String tagKeyword) {
        ListDto<ResourceFileDto> result = new ListDto<>();
        try{
            //构建es的查询条件
            EsSearchParams<ResourceFileDoc> params = new EsSearchParams<>();
            params.setPageNo(pageNo);
            params.setPageSize(pageSize);
            params.setClazz(ResourceFileDoc.class);
            if (null != tagKeyword && !tagKeyword.isEmpty()){
                params.setQuery(QueryBuilders.termQuery("tags", tagKeyword));
            } else {
                params.setQuery(QueryBuilders.matchAllQuery());
            }

            List<ResourceFileDoc> esResult = elasticService.search(params);
            if(!esResult.isEmpty()){
                List<ResourceFileDto> list = new ArrayList<>();
                for(ResourceFileDoc doc : esResult){
                    ResourceFileDto dto = new ResourceFileDto();
                    BeanUtils.copyProperties(doc, dto);
                    list.add(dto);
                }
                result.ok(list);
            }
        }catch(Exception e){
            result.fail();
        }
        return result;
    }

    @Override
    public ObjectDto<Void> saveFile(MultipartFile file, List<String> tags) {
        ObjectDto<Void> result = new ObjectDto<Void>();
        try {
            FileDto fileDto = new FileDto();
            String uuid = UUID.fastUUID().toString();
            String originalFilename = file.getOriginalFilename();
            //获取文件后缀
            assert originalFilename != null;
            String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
            var fileName = uuid + suffix;
            fileDto.setFileName(fileName);
            fileDto.setFileType(1);
            fileDto.setUrl(staticPathConfig.getOriginal() + fileName);
            fileDto.setPreviewUrl(staticPathConfig.getCompressed() + fileName);

            imageBusiness.saveImage(fileName, file.getInputStream());
            imageBusiness.addImageProcQueen(fileName);

            ResourceFile resourceFile = new ResourceFile();
            resourceFile.setUniqueCode(uuid);
            resourceFile.setName(fileName);
            resourceFile.setFile(OBJ_TO_JSON(fileDto));
            resourceFile.setFileType(1);
            resourceFile.setStatus(10);
            if (tags != null) {
                resourceFile.setTags(OBJ_TO_JSON(tags));
            }
            resourceFile.setDealStatus(0);
            resourceFile.setCreateTime(System.currentTimeMillis());
            this.save(resourceFile);
            ResourceFileDoc esDto = new ResourceFileDoc();
            BeanUtils.copyProperties(resourceFile, esDto);
            esDto.setFile(fileDto);
            if (tags != null) {
                esDto.setTags(tags);
            }
            //同步ES
            elasticService.save(esDto);
            //处理标签
            this.procTag(tags);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result.ok(null);
    }

    /**
     * 处理标签
     * @param tags
     */
    @Async
    public void procTag(List<String> tags){
        try{
            if(!tags.isEmpty()){
                //检测数据库有无
                for (String tag : tags) {
                    LambdaQueryWrapper<Tag> lqw = new LambdaQueryWrapper<>();
                    lqw.eq(Tag::getTag, tag);
                    boolean exists = tagMapper.exists(lqw);
                    if (!exists){
                        Tag record = new Tag();
                        record.setTag(tag);
                        record.setHotCount(0);
                        record.setCreateTime(System.currentTimeMillis());
                        record.setStatus(10);
                        record.insert();
                    }
                    String redisKey = RedisConstant.Today_Tags.getKey() + DateTimeUtils.getToday(null);
                    BoundHashOperations<String, Object, Object> bho = redisTemplate.boundHashOps(redisKey);
                    //添加到今日标签
                    bho.increment(tag, 1);
                    redisTemplate.expire(redisKey,24, TimeUnit.HOURS);
                }
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}

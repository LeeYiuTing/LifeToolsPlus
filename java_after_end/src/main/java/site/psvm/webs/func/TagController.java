package site.psvm.webs.func;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Controller;
import site.psvm.beans.dto.TagDto;
import site.psvm.common.enumType.RedisConstant;
import site.psvm.common.util.DateTimeUtils;
import site.psvm.webs.resp.Resp;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-05-08
 */
@Controller
@RequestMapping("/tag")
public class TagController {

    private final StringRedisTemplate stringRedisTemplate;

    @Autowired
    public TagController(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    /**
     * 获取热门标签列表
     */
    @RequestMapping("/hot")
    public Resp<List<TagDto>> getHotTagList() {
        Resp<List<TagDto>> result = new Resp<List<TagDto>>();
        Map<Object, Object> tags = stringRedisTemplate.opsForHash().entries(RedisConstant.Today_Tags.getKey() + DateTimeUtils.getToday(0));
        ArrayList<TagDto> tagDtos = new ArrayList<>();
        tags.forEach((k, v) -> {
            String tag = k.toString();
            Integer count = Integer.parseInt(v.toString());
            TagDto tagDto = new TagDto();
            tagDto.setTag(tag);
            tagDto.setHotCount(count);
            tagDtos.add(tagDto);
        });
        tagDtos.sort(Comparator.comparing(TagDto::getHotCount));
        result.ok(tagDtos);
        return result;
    }

}

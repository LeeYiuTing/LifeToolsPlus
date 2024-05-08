package site.psvm.beans.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import java.io.Serializable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * <p>
 * 
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-05-08
 */
@ApiModel(value = "Tag对象", description = "")
public class Tag extends Model<Tag> {

    private static final long serialVersionUID = 1L;

/*    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;*/

    private String tag;

    private Integer hotCount;

    private Integer status;

    private Long createTime;


    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Integer getHotCount() {
        return hotCount;
    }

    public void setHotCount(Integer hotCount) {
        this.hotCount = hotCount;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }


    @Override
    public String toString() {
        return "Tag{" +
            ", tag = " + tag +
            ", hotCount = " + hotCount +
            ", status = " + status +
            ", createTime = " + createTime +
        "}";
    }
}

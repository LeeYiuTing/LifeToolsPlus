package site.psvm.beans.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;

/**
 * <p>
 * 
 * </p>
 *
 * @author LeeYiuTing
 * @since 2024-04-29
 */
@TableName("resource_file")
@ApiModel(value = "ResourceFile对象", description = "")
public class ResourceFile extends Model<ResourceFile> {

    private static final long serialVersionUID = 1L;



    private String uniqueCode;

    private String name;

    private String tags;

    private String file;

    private Integer fileType;

    private Integer dealStatus;

    private Integer status;

    private Long createTime;


    public String getUniqueCode() {
        return uniqueCode;
    }

    public void setUniqueCode(String uniqueCode) {
        this.uniqueCode = uniqueCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Integer getFileType() {
        return fileType;
    }

    public void setFileType(Integer fileType) {
        this.fileType = fileType;
    }

    public Integer getDealStatus() {
        return dealStatus;
    }

    public void setDealStatus(Integer dealStatus) {
        this.dealStatus = dealStatus;
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
        return "ResourceFile{" +
            ", uniqueCode = " + uniqueCode +
            ", name = " + name +
            ", tags = " + tags +
            ", file = " + file +
            ", fileType = " + fileType +
            ", dealStatus = " + dealStatus +
            ", status = " + status +
            ", createTime = " + createTime +
        "}";
    }
}

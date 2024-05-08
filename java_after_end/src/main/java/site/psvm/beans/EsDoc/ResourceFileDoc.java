package site.psvm.beans.EsDoc;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import site.psvm.beans.dto.FileDto;

import java.util.List;

@Document(indexName = "resource_file")
public class ResourceFileDoc {
    @Id
    @Field(type = FieldType.Keyword)
    private String uniqueCode;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Keyword)
    private List<String> tags;

    private FileDto file;

    @Field(type = FieldType.Integer)
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

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public FileDto getFile() {
        return file;
    }

    public void setFile(FileDto file) {
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
        return "ResourceFileDoc{" +
                "uniqueCode='" + uniqueCode + '\'' +
                ", name='" + name + '\'' +
                ", tags=" + tags +
                ", file=" + file +
                ", fileType=" + fileType +
                ", dealStatus=" + dealStatus +
                ", status=" + status +
                ", createTime=" + createTime +
                '}';
    }
}

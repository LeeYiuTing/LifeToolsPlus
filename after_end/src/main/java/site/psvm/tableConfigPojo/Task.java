package site.psvm.tableConfigPojo;

import site.psvm.common.anno.FieldInfo;
import site.psvm.common.enumType.FieldType;
import site.psvm.common.anno.TableName;

@TableName
public class Task {

    @FieldInfo(type = FieldType.VARCHAR, length = 64, desc = "唯一码")
    private String uniqueCode;

    @FieldInfo(type = FieldType.VARCHAR, length = 20, desc = "任务名称")
    private String name;

    @FieldInfo(type = FieldType.INT, length = 20, desc = "创建时间")
    private Long createTime;

    @FieldInfo(type = FieldType.INT, length = 20, desc = "更新时间")
    private Long updateTime;

    @FieldInfo(type = FieldType.TINYINT, length = 2, desc = "状态")
    private Integer status;

    @FieldInfo(type = FieldType.VARCHAR, length = 200, desc = "描述")
    private String description;

    @FieldInfo(type = FieldType.TINYINT, length = 2, desc = "任务类型| 1:单次 2:周期")
    private Integer taskType;


    public Integer getTaskType() {
        return taskType;
    }

    public void setTaskType(Integer taskType) {
        this.taskType = taskType;
    }

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

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

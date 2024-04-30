package site.psvm.common.enumType;

public enum RedisConstant {

    TASK_MAP("task.map", "任务列表"),
    IMAGE_PROC_QUEUE("image.proc.queue", "图片处理队列"),
    ;


    private final String key;
    private final String desc;

    RedisConstant(String key, String desc) {
        this.key = key;
        this.desc = desc;
    }

    public String getKey(){
        return key;
    }
}

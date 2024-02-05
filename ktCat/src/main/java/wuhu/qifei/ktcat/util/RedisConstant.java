package wuhu.qifei.ktcat.util;

public enum RedisConstant {

    TASK_MAP("task.map", "任务列表");
    private String key;
    private String desc;

    RedisConstant(String key, String desc) {
        this.key = key;
        this.desc = desc;
    }

    public String getKey(){
        return key;
    }
}

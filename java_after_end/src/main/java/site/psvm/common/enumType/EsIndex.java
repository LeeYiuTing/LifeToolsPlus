package site.psvm.common.enumType;

public enum EsIndex {
    ResourceFile("resource_file", "资源文件"),
    ;
    private final String name;
    private final String desc;

    EsIndex(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }

    public String getName(){
        return name;
    }


    @Override
    public String toString() {
        return getName();
    }
}

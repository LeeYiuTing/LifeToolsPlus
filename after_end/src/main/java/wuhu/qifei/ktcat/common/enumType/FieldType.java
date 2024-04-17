package wuhu.qifei.ktcat.common.enumType;


/**
 * 定义字段类型
 */
public enum FieldType {
    VARCHAR("varchar"),
    INT("int"),
    BOOL("bit"),
    TINYINT("tinyint"),
    DOUBLE("real");

    final String name;

    FieldType(String name) {
        this.name = name;
    }


}

package wuhu.qifei.ktcat.common.anno;

import wuhu.qifei.ktcat.common.enumType.FieldType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface FieldInfo {

    //字段名
    String name() default "";

    //字段类型
    FieldType type();

    //字段长度
    int length();

    //字段描述
    String desc () default "";
}

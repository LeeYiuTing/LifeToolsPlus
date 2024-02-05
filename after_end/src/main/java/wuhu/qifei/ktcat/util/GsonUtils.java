package wuhu.qifei.ktcat.util;

import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

public class GsonUtils {
    public static GsonBuilder build = new GsonBuilder();

    public static GsonBuilder getBuild() {
        return build;
    }

    //json字符串转对象
    public static <T> T JSON_TO_OBJ(String json, Class<T> clazz) {
        return build.create().fromJson(json, clazz);
    }

    //对象转json字符串
    public static String OBJ_TO_JSON(Object obj) {
        return build.create().toJson(obj);
    }

    //json字符串转list
    public static <T> T JSON_TO_LIST(String json, Class<T> clazz) {
        Type type = TypeToken.getParameterized(List.class, clazz).getType();
        return build.create().fromJson(json, type);
    }
}



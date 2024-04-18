package site.psvm.common.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

public class GsonUtils {
    public static Gson gson = new GsonBuilder().create();

    //json字符串转对象
    public static <T> T JSON_TO_OBJ(String json, Class<T> clazz) {
        return gson.fromJson(json, clazz);
    }

    //对象转json字符串
    public static String OBJ_TO_JSON(Object obj) {
        return gson.toJson(obj);
    }

    //json字符串转list
    public static <T> T JSON_TO_LIST(String json, Class<T> clazz) {
        Type type = TypeToken.getParameterized(List.class, clazz).getType();
        return gson.fromJson(json, type);
    }
}



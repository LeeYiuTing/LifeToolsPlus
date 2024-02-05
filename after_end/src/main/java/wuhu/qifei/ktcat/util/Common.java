package wuhu.qifei.ktcat.util;

public class Common {

    public static <T> Resp<T> packResp(String code, String msg, T data) {
        Resp<T> resp = new Resp<T>();
        resp.setCode(code);
        resp.setMsg(msg);
        resp.setData(data);
        return resp;
    }

}

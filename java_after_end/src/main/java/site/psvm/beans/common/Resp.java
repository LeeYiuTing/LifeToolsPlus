package site.psvm.beans.common;

public class Resp<T> {
    private String code;
    private String msg;
    private T data;

    public Resp() {
    }



    public static <T> Resp<T> ok(T data) {
        Resp<T> resp = new Resp<T>();
        resp.setCode("001");
        resp.setMsg("success");
        resp.setData(data);
        return resp;
    }

    public static <T> Resp<T> fail() {
        Resp<T> resp = new Resp<T>();
        resp.setCode("000");
        resp.setMsg("fail");
        return resp;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}

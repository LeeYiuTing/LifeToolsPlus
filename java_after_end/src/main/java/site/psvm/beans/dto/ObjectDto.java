package site.psvm.beans.dto;

public class ObjectDto<T>{
    private T data;
    private String code;
    private String msg;

    public ObjectDto<T> ok (T data){
        this.code = "001";
        this.msg = "success";
        this.data = data;
        return this;
    }

    public ObjectDto<T> fail (T data){
        this.code = "000";
        this.msg = "fail";
        return this;
    }

    public ObjectDto() {
    }


    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
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
}

package site.psvm.beans.dto;

import java.util.List;

public class ListDto<T> {
    private List<T> data;
    private String code;
    private String msg;

    public void ok(List<T> data) {
        this.code = "001";
        this.msg = "success";
        this.data = data;
    }

    public void fail() {
        this.code = "000";
        this.msg = "fail";
    }

    public ListDto() {

    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
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

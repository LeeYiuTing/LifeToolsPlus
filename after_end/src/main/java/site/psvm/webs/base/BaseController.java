package site.psvm.webs.base;

import site.psvm.webs.resp.Resp;

/**
 * Controller通用方法
 * @author LeeYiuTing
 */
public class BaseController {

    public static <T> Resp<T> packResp(String code, String msg, T data) {
        Resp<T> resp = new Resp<T>();
        resp.setCode(code);
        resp.setMsg(msg);
        resp.setData(data);
        return resp;
    }
}

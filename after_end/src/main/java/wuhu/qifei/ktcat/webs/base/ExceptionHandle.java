package wuhu.qifei.ktcat.webs.base;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import wuhu.qifei.ktcat.webs.resp.Resp;


@RestControllerAdvice
public class ExceptionHandle extends BaseController {

    @ExceptionHandler(value = Exception.class)
    public Resp<String> handle(Exception e) {
        return packResp("500", e.getMessage(), null);
    }
}

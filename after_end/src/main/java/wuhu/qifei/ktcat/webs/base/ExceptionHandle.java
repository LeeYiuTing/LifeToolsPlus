package wuhu.qifei.ktcat.webs.base;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import wuhu.qifei.ktcat.webs.resp.Resp;


@RestControllerAdvice
public class ExceptionHandle extends BaseController {

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = Exception.class)
    public Resp<String> handle(Exception e) {
        System.out.println(e.getMessage());
        return packResp("500", e.getMessage(), null);
    }
}

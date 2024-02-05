package wuhu.qifei.ktcat.util;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static wuhu.qifei.ktcat.util.Common.packResp;

@RestControllerAdvice
public class ExceptionHandle {

    @ExceptionHandler(value = Exception.class)
    public Resp<String> handle(Exception e) {
        return packResp("500", e.getMessage(), null);
    }
}

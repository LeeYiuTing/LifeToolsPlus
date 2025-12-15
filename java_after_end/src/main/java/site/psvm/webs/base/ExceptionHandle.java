package site.psvm.webs.base;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import site.psvm.beans.common.Resp;


@RestControllerAdvice
public class ExceptionHandle extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandle.class);

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = Exception.class)
    public Resp<String> handle(Exception e) {
        logger.error("ExceptionHandle,handle,error",e);
        return Resp.fail();
    }
}

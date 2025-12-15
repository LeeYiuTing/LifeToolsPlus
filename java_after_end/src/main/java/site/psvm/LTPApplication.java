package site.psvm;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@MapperScan("site.psvm.mapper")
public class LTPApplication {

    private static final Logger logger = LoggerFactory.getLogger(LTPApplication.class);

    public static void main(String[] args) {
        System.out.println("Current working directory: " + System.getProperty("user.dir"));
        var ctx = SpringApplication.run(LTPApplication.class, args);
        logger.info("这是一条信息日志");
        logger.debug("这是一条调试日志");
        logger.warn("这是一条警告日志");
        logger.error("这是一条错误日志");

    }

}

package site.psvm;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@MapperScan("site.psvm.mapper")
public class LTPApplication {

    public static void main(String[] args) {
        var ctx = SpringApplication.run(LTPApplication.class, args);
    }

}

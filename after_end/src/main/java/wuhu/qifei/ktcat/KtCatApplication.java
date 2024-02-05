package wuhu.qifei.ktcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KtCatApplication {

    public static void main(String[] args) {
        var ctx = SpringApplication.run(KtCatApplication.class, args);
    }

}

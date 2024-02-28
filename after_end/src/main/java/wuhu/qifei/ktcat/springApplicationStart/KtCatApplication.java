package wuhu.qifei.ktcat.springApplicationStart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.cors.reactive.CorsWebFilter;

@EnableScheduling
@SpringBootApplication
@ComponentScan("wuhu.qifei.ktcat.*")
public class KtCatApplication {

    public static void main(String[] args) {
        var ctx = SpringApplication.run(KtCatApplication.class, args);
    }

}

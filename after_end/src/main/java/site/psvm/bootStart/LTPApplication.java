package site.psvm.bootStart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LTPApplication {

    public static void main(String[] args) {
        var ctx = SpringApplication.run(LTPApplication.class, args);
    }

}

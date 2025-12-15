package site.psvm.service.Scheduling.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ExecutorService;

/**
 * 线程池配置类
 */
@Configuration
@EnableAsync
public class SchedulingConfig {

    @Bean("imageProcessExecutor")
    public ExecutorService imageProcessExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("image-process-");
        executor.initialize();
        return executor.getThreadPoolExecutor();
    }
}

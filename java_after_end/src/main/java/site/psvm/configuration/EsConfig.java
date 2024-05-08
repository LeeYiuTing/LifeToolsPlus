package site.psvm.configuration;

import cn.hutool.core.lang.ClassScanner;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.IndexOperations;

import java.util.Set;

@Configuration
public class EsConfig {

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        RestClientBuilder builder = RestClient.builder(
                new HttpHost("localhost", 9200, "http"));
        return new RestHighLevelClient(builder);
    }

    /**
     * 创建并配置ElasticsearchRestTemplate，自动扫描指定包下所有类，对标注了@Document注解的类对应的Elasticsearch索引进行初始化。
     *
     * @return ElasticsearchRestTemplate 用于和Elasticsearch进行交互的模板类
     */
    @Bean
    public ElasticsearchRestTemplate elasticsearchRestTemplate() {
        ElasticsearchRestTemplate template = new ElasticsearchRestTemplate(restHighLevelClient());

        // 扫描指定包下所有类
        Set<Class<?>> classes = ClassScanner.scanPackage("site.psvm.beans.EsDoc");

        // 遍历扫描到的类，对标注了@Document注解的类进行索引的创建和映射设置
        for (Class<?> clazz : classes) {
            Document annotation = clazz.getAnnotation(Document.class);
            if (annotation == null) { // 如果类上没有@Document注解，则跳过
                continue;
            }

            // 获取当前类对应的索引操作接口
            IndexOperations indexOperations = template.indexOps(clazz);
            boolean exists = indexOperations.exists(); // 检查索引是否存在

            // 如果索引不存在，则创建索引并设置映射
            if (!exists) {
                indexOperations.create();
                indexOperations.putMapping(indexOperations.createMapping());
            }
        }

        return template;
    }



}

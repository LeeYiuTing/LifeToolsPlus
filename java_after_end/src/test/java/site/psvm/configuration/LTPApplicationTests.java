package site.psvm.configuration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import site.psvm.beans.EsDoc.ResourceFileDoc;

import java.util.List;

import static org.elasticsearch.index.query.QueryBuilders.matchAllQuery;

@SpringBootTest
class LTPApplicationTests {

    private final ElasticsearchRestTemplate esRestTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    LTPApplicationTests(ElasticsearchRestTemplate esRestTemplate) {
        this.esRestTemplate = esRestTemplate;
    }

    @Test
    public void t01() {
        Query query = new NativeSearchQueryBuilder()
                .withQuery(matchAllQuery()) // 使用 match_all 查询，你可以替换为更具体的 Query
                .build();

        SearchHits<ResourceFileDoc> search = esRestTemplate.search(query, ResourceFileDoc.class);
        List<SearchHit<ResourceFileDoc>> searchHits = search.getSearchHits();
        searchHits.forEach(searchHit -> {
            ResourceFileDoc content = searchHit.getContent();
        });
    }

    @Test
    public void tt02 () {
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
        zSetOps.add("tempQueue", "hahaha", System.currentTimeMillis() + 30*24*60*60*1000L); //过期时间为30天后
    }

}

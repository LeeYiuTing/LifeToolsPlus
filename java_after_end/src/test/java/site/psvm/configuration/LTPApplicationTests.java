package site.psvm.configuration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import site.psvm.beans.EsDoc.ResourceFileDoc;

import java.util.List;

import static org.elasticsearch.index.query.QueryBuilders.matchAllQuery;

@SpringBootTest
class LTPApplicationTests {

    private final ElasticsearchRestTemplate esRestTemplate;

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

}

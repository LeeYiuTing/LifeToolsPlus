package site.psvm.service.elastic;

import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.mapping.MappingException;
import org.springframework.stereotype.Component;
import site.psvm.beans.dto.EsSearchParams;

import java.util.ArrayList;
import java.util.List;

import static org.elasticsearch.index.query.QueryBuilders.matchAllQuery;


@Component
public class ElasticService {

    private final RestHighLevelClient client;
    private final ElasticsearchRestTemplate esRestTemplate;


    @Autowired
    public ElasticService(RestHighLevelClient client, ElasticsearchRestTemplate restTemplate) {
        this.client = client;
        this.esRestTemplate = restTemplate;
    }

    public void save(Object document) {
        try {
            esRestTemplate.save(document);
        } catch (MappingException e) {
            e.printStackTrace();

        }
    }

    public <T> List<T> search(EsSearchParams params) {
        Integer pageNo = params.getPageNo();
        Integer pageSize = params.getPageSize();
        QueryBuilder queryBuilder = params.getQuery();
        Class<T> clazz = params.getClazz();

        // 处理分页参数，默认值为第1页，每页10条记录
        pageNo = (pageNo == null) ? 1 : pageNo;
        pageSize = (pageSize == null) ? 10 : pageSize;
        // 将pageNumber减1以适应分页逻辑
        int effectivePageNumber = pageNo - 1;

        // 处理查询构建器的空值情况
        QueryBuilder queryCondition = (queryBuilder == null) ? matchAllQuery() : queryBuilder;
        Query query = new NativeSearchQueryBuilder()
                .withQuery(queryCondition)
                .build();

        // 设置分页请求
        PageRequest pageable = PageRequest.of(effectivePageNumber, pageSize);
        query.setPageable(pageable);

        // 执行搜索操作
        List<T> results = new ArrayList<>();
        try {
            SearchHits<T> searchHits = esRestTemplate.search(query, clazz);
            // 使用增强的for循环遍历搜索结果并填充结果列表
            for (SearchHit<T> hit : searchHits) {
                results.add(hit.getContent());
            }
        } catch (Exception e) {
            // 可以根据实际情况记录日志或者抛出自定义异常
            e.printStackTrace();
            // 根据需求处理异常，例如返回空列表或特定异常
            return new ArrayList<>();
        }

        return results;
    }

}
package site.psvm.service.elastic;

import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.mapping.MappingException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
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

    private static final Logger logger = LoggerFactory.getLogger(ElasticService.class);

    public void save(Object document) {
        try {
            esRestTemplate.save(document);
        } catch (MappingException e) {
            logger.error("ElasticService,save,error,{}",document,e);
        }
    }

    public <T> List<T> search(EsSearchParams<T> params) {
        Integer pageNo = params.getPageNo();
        Integer pageSize = params.getPageSize();
        List<QueryBuilder> queryBuilderList = params.getQueryBuilderList();
        Class<T> clazz = params.getClazz();
        SortBuilders.fieldSort("timestamp").order(SortOrder.DESC);

        // 处理分页参数，默认值为第1页，每页10条记录
        pageNo = (pageNo == null) ? 1 : pageNo;
        pageSize = (pageSize == null) ? 10 : pageSize;
        // 将pageNumber减1以适应分页逻辑
        int effectivePageNumber = pageNo - 1;

        // 处理查询构建器的空值情况
        if (CollectionUtils.isEmpty(queryBuilderList)) {
            queryBuilderList = new ArrayList<>();
            queryBuilderList.add(matchAllQuery());
        }

        // 处理查询条件
        NativeSearchQueryBuilder builder = new NativeSearchQueryBuilder();
        for (QueryBuilder queryBuilder : queryBuilderList) {
            builder.withQuery(queryBuilder);
        }

        // 处理排序
        if (!CollectionUtils.isEmpty(params.getSortOrderList())){
            for (FieldSortBuilder sortOrder : params.getSortOrderList()) {
                builder.withSort(sortOrder);
            }
        }

        // 构建查询
        NativeSearchQuery query = builder.build();

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
            logger.error("ElasticService,search,error,{}",params,e);
            // 根据需求处理异常，例如返回空列表或特定异常
            return new ArrayList<>();
        }

        return results;
    }

}
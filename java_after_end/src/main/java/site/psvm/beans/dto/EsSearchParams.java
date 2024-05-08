package site.psvm.beans.dto;

import org.elasticsearch.index.query.QueryBuilder;

/**
 * ElasticSearch 查询参数
 *
 */
public class EsSearchParams <T>{
    private Integer pageNo;
    private Integer pageSize;
    private QueryBuilder query;
    private Class<T> clazz;

    public Integer getPageNo() {
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public QueryBuilder getQuery() {
        return query;
    }

    public void setQuery(QueryBuilder query) {
        this.query = query;
    }

    public Class<T> getClazz() {
        return clazz;
    }

    public void setClazz(Class<T> clazz) {
        this.clazz = clazz;
    }
}

package site.psvm.beans.dto;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;

import java.util.List;

/**
 * ElasticSearch 查询参数
 *
 */
public class EsSearchParams <T>{
    private Integer pageNo;
    private Integer pageSize;
    private List<QueryBuilder> queryBuilderList;
    private List<FieldSortBuilder> sortOrderList;
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

    public List<QueryBuilder> getQueryBuilderList() {
        return queryBuilderList;
    }

    public void setQueryBuilderList(List<QueryBuilder> queryBuilderList) {
        this.queryBuilderList = queryBuilderList;
    }

    public List<FieldSortBuilder> getSortOrderList() {
        return sortOrderList;
    }

    public void setSortOrderList(List<FieldSortBuilder> sortOrderList) {
        this.sortOrderList = sortOrderList;
    }

    public Class<T> getClazz() {
        return clazz;
    }

    public void setClazz(Class<T> clazz) {
        this.clazz = clazz;
    }
}

package site.psvm.webs.request;

/**
 * 资源文件搜索请求参数
 */
public class ResourceFileSearchRequest {
    /**
     * 搜索关键字
     */
    private String keyword;
    
    /**
     * 页码，从1开始
     */
    private Integer page = 1;
    
    /**
     * 每页大小
     */
    private Integer size = 20;

    // Getter and Setter methods
    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}

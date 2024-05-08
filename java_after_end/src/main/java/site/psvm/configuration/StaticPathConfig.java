package site.psvm.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 读取配置文件
 */
@Configuration
@ConfigurationProperties(prefix = "static-path")
public class StaticPathConfig {
    private String original;
    private String originalDiskPath;

    private String compressed;
    private String compressedDiskPath;


    public StaticPathConfig() {
    }

    public String getOriginalDiskPath() {
        return originalDiskPath;
    }

    public void setOriginalDiskPath(String originalDiskPath) {
        this.originalDiskPath = originalDiskPath;
    }

    public String getCompressedDiskPath() {
        return compressedDiskPath;
    }

    public void setCompressedDiskPath(String compressedDiskPath) {
        this.compressedDiskPath = compressedDiskPath;
    }

    public String getOriginal() {
        return original;
    }

    public void setOriginal(String original) {
        this.original = original;
    }

    public String getCompressed() {
        return compressed;
    }

    public void setCompressed(String compressed) {
        this.compressed = compressed;
    }
}

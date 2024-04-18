package site.psvm.bootStart;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.sql.Types;
import java.util.Collections;
import java.util.function.Consumer;

public class CodeGenerate {
    public static void main(String[] args) {
        FastAutoGenerator fastAutoGenerator = FastAutoGenerator.create("jdbc:sqlite:test.db", "", "");
        //全局配置
        fastAutoGenerator.globalConfig(builder -> {
            builder.author("LeeYiuTing") // 设置作者
                    .enableSwagger() // 开启 swagger 模式
                    .outputDir("D:\\D_DEV\\Project\\LifeToolsPlus\\after_end\\src\\main\\java"); // 指定输出目录
        });

        //数据源配置
        fastAutoGenerator.dataSourceConfig(builder -> builder.typeConvertHandler((globalConfig, typeRegistry, metaInfo) -> {
            int typeCode = metaInfo.getJdbcType().TYPE_CODE;
            if (typeCode == Types.SMALLINT) {
                // 自定义类型转换
                return DbColumnType.INTEGER;
            }
            return typeRegistry.getColumnType(metaInfo);
        }));

        //包配置
        fastAutoGenerator.packageConfig(builder -> {
            builder.parent("site.psvm") // 设置父包名
                    .controller("webs.func")
                    .entity("pojo")
                    .pathInfo(Collections.singletonMap(OutputFile.xml, "D:\\D_DEV\\Project\\LifeToolsPlus\\after_end\\src\\main\\resources\\mapper")); // 设置mapperXml生成路径
        });

        //策略配置
        String[] tables = {"task"};
        fastAutoGenerator.strategyConfig(builder -> {
            builder.addInclude(tables) // 设置需要生成的表名
                    .addTablePrefix("t_", "c_"); // 设置过滤表前缀
        }).templateEngine(new FreemarkerTemplateEngine()); // 使用Freemarker引擎模板，默认的是Velocity引擎模板

        fastAutoGenerator.execute();
    }
}

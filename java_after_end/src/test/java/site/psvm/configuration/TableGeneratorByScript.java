package site.psvm.configuration;


import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;


import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 读取脚本文件，生成表及代码
 */
public class TableGeneratorByScript {

    public static void main(String[] args) throws URISyntaxException, IOException {
        generatorTable();
    }

    private static void generatorTable() throws URISyntaxException, IOException {
        try {
            String scriptPackagePath = "TableScript";
            // 获取当前类加载器
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();

            // 使用ClassLoader.getResource()方法获取资源文件夹URL
            URL resourceFolderUrl = classLoader.getResource(scriptPackagePath);
            if (resourceFolderUrl == null) {
                throw new IllegalArgumentException("Resource folder 'scriptPackagePath' not found on classpath");
            }

            // 将URL转换为Path对象
            Path folderPath;
            if (resourceFolderUrl.getProtocol().equals("jar")) {
                // 如果资源位于JAR文件中，使用JarURLConnection处理
                folderPath = Paths.get(new URI(resourceFolderUrl.toExternalForm()));
            } else {
                // 如果资源位于文件系统中，直接转换路径
                folderPath = Paths.get(resourceFolderUrl.toURI());
            }

            // 读取文件夹下的所有文件
            List<Path> paths = Files.list(folderPath).toList();
            ArrayList<Path> applyPaths = new ArrayList<>();
            paths.forEach(path -> {
                if (path.toString().endsWith(".tablescript")) {
                    applyPaths.add(path);
                }
            });


            Class.forName("org.sqlite.JDBC");
            Connection connection = DriverManager.getConnection("jdbc:sqlite:test.db");
            Statement statement = connection.createStatement();

            for (Path path : applyPaths) {
                //读取文件第一行
                List<String> scriptRows = Files.readAllLines(path);
                List<String[]> fieldInfoList = new ArrayList<>();
                String tableName = "";
                String tableNameCow = scriptRows.getFirst();
                if (tableNameCow.endsWith("off")){
                    continue;
                }
                for (int i = 0; i < scriptRows.size(); i++) {
                    String scriptRow = scriptRows.get(i);
                    if (i == 0) {
                        tableName = scriptRow.replace("@", "");
                        if (tableName.isEmpty()) {
                            throw new IllegalArgumentException("Table name cannot be empty");
                        }

                    } else {
                        String[] columns = scriptRow.split(",");
                        if (columns.length < 4) {
                            throw new IllegalArgumentException("Invalid script format: "+tableName);
                        }
                        for (String column : columns) {
                            if (column.isEmpty()) {
                                throw new IllegalArgumentException("Invalid script format");
                            }
                        }
                        fieldInfoList.add(columns);
                    }
                }
                if (fieldInfoList.isEmpty()) {
                    //没有字段
                    throw new IllegalArgumentException("Table cannot be empty: " + tableName);
                }
                //拼接sql
                StringBuilder createTableQuery = new StringBuilder("CREATE TABLE IF NOT EXISTS ")
                        .append(tableName)
                        .append(" (")
                        .append("\n");
                //先添加一个自增主键
                createTableQuery.append("id INTEGER PRIMARY KEY AUTOINCREMENT, ");
                //遍历字段
                for (String[] field : fieldInfoList) {
                    //字段名
                    String fieldName = field[0];
                    //字段类型
                    String fieldType = field[1];
                    //字段描述
                    Integer fieldLength = Integer.parseInt(field[2]);
                    //字段长度
                    String fieldDescription = field[3];
                    //拼接sql
                    createTableQuery.append(fieldName).append(" ").append(fieldType);
                    //如果有给定长度
                    if (fieldLength > 0) {
                        createTableQuery.append("(").append(fieldLength).append(")");
                    }

                    createTableQuery.append(", ");

                    //如果有描述
                    if (!fieldDescription.isEmpty()) {
                        createTableQuery.append(" -- ").append(fieldDescription);
                    }

                    createTableQuery.append("\n");
                }

                createTableQuery.append("status int(3), -- 记录状态| 10:正常 30:删除\n");
                createTableQuery.append("create_time bigint(20) -- 创建时间\n");
                createTableQuery.append(");");
                String sql = createTableQuery.toString();
                System.out.println(sql);
                statement.executeUpdate(sql);
                System.out.println("Table created for class: " + tableName);
                generateCode(tableName);
            }

            statement.close();
            connection.close();

        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }

    public static void generateCode(String tableName) {
        FastAutoGenerator fastAutoGenerator = FastAutoGenerator.create("jdbc:sqlite:test.db", "", "");
        //全局配置
        fastAutoGenerator.globalConfig(builder -> {
            builder.author("LeeYiuTing") // 设置作者
                    .enableSwagger() // 开启 swagger 模式
                    .outputDir("D:\\D_DEV\\Project\\LifeToolsPlus\\java_after_end\\src\\main\\java"); // 指定输出目录
        });

        //数据源配置
        fastAutoGenerator.dataSourceConfig(builder -> builder.typeConvertHandler((globalConfig, typeRegistry, metaInfo) -> {
            int typeCode = metaInfo.getJdbcType().TYPE_CODE;
            String typeName = metaInfo.getTypeName();
            // 自定义类型转换
            if (typeCode == Types.SMALLINT) {
                return DbColumnType.INTEGER;
            }
            if (typeName.equals("BIGINT")) {
                return DbColumnType.LONG;
            }
            return typeRegistry.getColumnType(metaInfo);
        }));

        //包配置
        fastAutoGenerator.packageConfig(builder -> {
            builder.parent("site.psvm") // 设置父包名
                    .controller("webs.func")
                    .entity("beans.entity")
                    .pathInfo(Collections.singletonMap(OutputFile.xml, "D:\\D_DEV\\Project\\LifeToolsPlus\\java_after_end\\src\\main\\resources\\mapper")); // 设置mapperXml生成路径
        });

        //策略配置
        fastAutoGenerator.strategyConfig(builder -> {
            builder.addInclude(tableName) // 设置需要生成的表名
                    .addTablePrefix("t_", "c_"); // 设置过滤表前缀
        }).templateEngine(new FreemarkerTemplateEngine()); // 使用Freemarker引擎模板，默认的是Velocity引擎模板

        fastAutoGenerator.strategyConfig(builder -> {
            builder.entityBuilder()
                    .enableFileOverride()// 开启覆盖文件
                    .enableActiveRecord();// 开启 ActiveRecord 模式
        });

        fastAutoGenerator.execute();
    }

    //将驼峰命名转换为下划线命名
    private static String toSnakeCase(String input) {
        return input.replaceAll("([a-z0-9])([A-Z])", "$1_$2").toLowerCase();
    }
}

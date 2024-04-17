package wuhu.qifei.ktcat.springApplicationStart;

import cn.hutool.core.lang.ClassScanner;
import wuhu.qifei.ktcat.common.anno.FieldInfo;
import wuhu.qifei.ktcat.common.anno.TableName;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Set;

/**
 *
 * 根据实体类生成数据库表
 */
public class TableGenerator {

    public static void main(String[] args) {
        String packageName = "wuhu.qifei.ktcat.pojo";
        try {
            Class.forName("org.sqlite.JDBC");
            Connection connection = DriverManager.getConnection("jdbc:sqlite:test.db");
            Statement statement = connection.createStatement();

            // 扫描指定包下的所有类
            Set<Class<?>> classes = ClassScanner.scanPackage(packageName);

            for (Class<?> clazz : classes) {
                if (clazz.isAnnotationPresent(TableName.class)) {
                    TableName tableNameAnnotation = clazz.getAnnotation(TableName.class);
                    String tableName = tableNameAnnotation.value().isEmpty() ? toSnakeCase(clazz.getSimpleName()) : tableNameAnnotation.value();
                    StringBuilder createTableQuery = new StringBuilder("CREATE TABLE IF NOT EXISTS ")
                            .append(tableName)
                            .append(" (")
                            .append("\n");
                    //先添加一个自增主键
                    createTableQuery.append("id INTEGER PRIMARY KEY AUTOINCREMENT, ");
                    Field[] fields = clazz.getDeclaredFields();
                    var fieldCount = 0;
                    for (Field field : fields) {
                        if (field.isAnnotationPresent(FieldInfo.class)) {
                            fieldCount++;
                            FieldInfo fieldAnnotation = field.getAnnotation(FieldInfo.class);
                            //字段名
                            String fieldName = fieldAnnotation.name().isEmpty() ? toSnakeCase(field.getName()) : fieldAnnotation.name();
                            //字段类型
                            String fieldType = fieldAnnotation.type() == null ? getSqlType(field.getType().getSimpleName()) : fieldAnnotation.type().name();
                            //字段描述
                            String fieldDesc = fieldAnnotation.desc();
                            //字段长度
                            int fieldLength = fieldAnnotation.length();
                            //拼接sql
                            createTableQuery.append(fieldName).append(" ").append(fieldType);
                            //如果有给定长度
                            if (fieldLength > 0) {
                                createTableQuery.append("(").append(fieldLength).append(")");
                            }
                            //如果不是最后一个字段
                            if (fieldCount < fields.length) {
                                createTableQuery.append(", ");
                            }
                            //如果有描述
                            if (!fieldDesc.isEmpty()) {
                                createTableQuery.append(" -- ").append(fieldDesc);
                            }
                            createTableQuery.append("\n");
                        }
                    }
                    //如果有字段,建表
                    if (fieldCount > 0) {
                        createTableQuery.append(");");
                        String sql = createTableQuery.toString();
                        System.out.println(sql);
                        statement.executeUpdate(sql);
                        System.out.println("Table created for class: " + clazz.getName());
                    } else {
                        System.out.println("No fields annotated with @FieldInfo found in class: " + clazz.getName());
                    }
                }
            }

            statement.close();
            connection.close();

        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }

    private static String toSnakeCase(String input) {
        return input.replaceAll("([a-z0-9])([A-Z])", "$1_$2").toLowerCase();
    }

    private static String getSqlType(String javaType) {
        String result = switch (javaType) {
            case "String" -> "TEXT";
            case "int", "Integer" -> "INTEGER";
            case "double", "Double" -> "REAL";
            default -> "TEXT"; // Default to TEXT if type not recognized
        };
        return result;
    }
}

package site.psvm.common.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateTimeUtils {

    /**
     * 获取今日日期 格式: yyyyMMdd
     * @param offset 正数为往后几日,负数为往前几日
     * @return 返回格式化的日期字符串
     */
    public static String getToday(Integer offset) {
        if (offset == null) {
            offset = 0;
        }
        // 获取当前日期
        LocalDate currentDate = LocalDate.now();
        // 根据偏移量调整日期
        currentDate = currentDate.plusDays(offset);
        // 创建日期格式化器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        // 格式化日期为字符串
        String formattedDate = currentDate.format(formatter);
        // 返回格式化后的日期
        return formattedDate;
    }
}

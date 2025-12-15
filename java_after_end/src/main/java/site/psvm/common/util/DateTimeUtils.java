package site.psvm.common.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
        // 返回格式化后的日期
        return currentDate.format(formatter);
    }

    /**
     * 将时间戳转换为日期时间字符串 格式: yyyy-MM-dd HH:mm:ss
     * @param time 时间戳(毫秒)
     * @return 返回格式化的日期时间字符串
     */
    public static String timeToStr(Long time, String format) {
        if (time == null) {
            time = System.currentTimeMillis();
        }
        if (format == null || format.isEmpty()) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        // 将毫秒时间戳转换为LocalDateTime
        Instant instant = Instant.ofEpochMilli(time);
        LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        // 创建日期时间格式化器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        // 格式化日期时间为字符串
        return dateTime.format(formatter);
    }

    public static String timeToStr() {
        return timeToStr(null, null);
    }

}

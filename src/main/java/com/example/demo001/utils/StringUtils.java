package com.example.demo001.utils;

/**
 * @author chenqi
 * @date 2020/11/11 10:35
 */
public class StringUtils {
    public static boolean isNotBlank(String message) {
        return message!=null&&!message.trim().isEmpty();
    }
}

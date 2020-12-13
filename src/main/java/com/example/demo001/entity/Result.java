package com.example.demo001.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class Result<T> {
    private boolean success;
    private T data;
    private String msg;
    private int code;

    public Result(boolean success) {
        this.success = success;
        this.code=500;
    }
}

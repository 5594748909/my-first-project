package com.example.backend.common;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "统一响应结构")
public class ApiResponse<T> {

    @Schema(description = "业务状态码，0表示成功")
    private final int code;

    @Schema(description = "响应消息")
    private final String message;

    @Schema(description = "响应数据")
    private final T data;

    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(0, message, data);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
}


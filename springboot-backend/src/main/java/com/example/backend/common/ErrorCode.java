package com.example.backend.common;

public enum ErrorCode {
    VALIDATION_ERROR(4001, "请求参数不合法"),
    BUSINESS_ERROR(4002, "业务处理失败"),
    NOT_FOUND(4004, "请求资源不存在"),
    METHOD_NOT_ALLOWED(4005, "请求方法不支持"),
    INTERNAL_ERROR(5000, "服务内部异常");

    private final int code;
    private final String defaultMessage;

    ErrorCode(int code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public int getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}


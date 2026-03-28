package com.example.backend.logging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局请求日志过滤器
 * 记录 URL、IP、参数、耗时、响应结果（可用于生产排障）
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final int MAX_LOG_BODY_LENGTH = 2000;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith("/swagger-ui")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/actuator");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            long costMs = System.currentTimeMillis() - startTime;
            String requestBody = getRequestBody(requestWrapper);
            String responseBody = getResponseBody(responseWrapper);

            Map<String, Object> requestSummary = new HashMap<>();
            requestSummary.put("method", request.getMethod());
            requestSummary.put("url", request.getRequestURI());
            requestSummary.put("query", request.getQueryString());
            requestSummary.put("ip", resolveClientIp(request));
            requestSummary.put("headers", getHeaders(request));
            requestSummary.put("requestBody", truncate(requestBody));
            requestSummary.put("status", responseWrapper.getStatus());
            requestSummary.put("responseBody", truncate(responseBody));
            requestSummary.put("costMs", costMs);

            log.info("HTTP_ACCESS {}", safeJson(requestSummary));
            responseWrapper.copyBodyToResponse();
        }
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(xRealIp)) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }

    private Map<String, String> getHeaders(HttpServletRequest request) {
        Enumeration<String> headerNames = request.getHeaderNames();
        if (headerNames == null) {
            return Collections.emptyMap();
        }

        Map<String, String> result = new HashMap<>();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String value = request.getHeader(headerName);

            // 生产环境避免打印敏感头
            if ("authorization".equalsIgnoreCase(headerName)) {
                result.put(headerName, "***");
            } else {
                result.put(headerName, value);
            }
        }
        return result;
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] buffer = request.getContentAsByteArray();
        if (buffer.length == 0) {
            return "";
        }
        return new String(buffer, StandardCharsets.UTF_8);
    }

    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] buffer = response.getContentAsByteArray();
        if (buffer.length == 0) {
            return "";
        }

        String contentType = response.getContentType();
        if (contentType != null && !contentType.contains(MediaType.APPLICATION_JSON_VALUE)) {
            return "[non-json-response omitted]";
        }
        return new String(buffer, StandardCharsets.UTF_8);
    }

    private String truncate(String value) {
        if (!StringUtils.hasText(value)) {
            return value;
        }
        if (value.length() <= MAX_LOG_BODY_LENGTH) {
            return value;
        }
        return value.substring(0, MAX_LOG_BODY_LENGTH) + "...(truncated)";
    }

    private String safeJson(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            return payload.toString();
        }
    }
}


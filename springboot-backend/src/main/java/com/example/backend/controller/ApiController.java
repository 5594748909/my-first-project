package com.example.backend.controller;

import com.example.backend.common.ApiResponse;
import com.example.backend.exception.BusinessException;
import com.example.backend.model.ChatRequest;
import com.example.backend.model.ChatResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Game API", description = "游戏测试与AI问答接口")
public class ApiController {

    @GetMapping("/test")
    @Operation(summary = "联调测试接口", description = "用于前后端联调与健康检查")
    public ApiResponse<Map<String, Object>> test() {
        return ApiResponse.success(Map.of(
                "ok", true,
                "service", "springboot-backend"
        ));
    }

    @PostMapping("/chat")
    @Operation(
            summary = "AI问答接口（示例）",
            description = "示例实现：根据 question 与 story 返回标准答案。生产环境请替换为真实 AI 服务调用。",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "成功"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "400",
                            description = "参数错误",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(value = "{\"code\":4001,\"message\":\"question 不能为空\",\"data\":null}")
                            )
                    )
            }
    )
    public ApiResponse<ChatResult> chat(@Valid @RequestBody ChatRequest request) {
        // 示例：你可以在这里接入 DeepSeek/OpenAI 等真实服务
        String q = request.getQuestion().trim();
        if (q.length() > 100) {
            throw new BusinessException("问题过长，请简化后重试");
        }

        // 极简规则示例（仅演示接口结构）
        String answer;
        if (q.contains("认识") || q.contains("相关")) {
            answer = "是";
        } else if (q.contains("天气") || q.contains("时间")) {
            answer = "无关";
        } else {
            answer = "否";
        }

        return ApiResponse.success(new ChatResult(answer));
    }
}


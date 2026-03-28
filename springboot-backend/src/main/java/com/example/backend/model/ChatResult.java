package com.example.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "AI问答结果")
public class ChatResult {

    @Schema(description = "AI回答，只会是：是/否/无关", example = "无关")
    private String answer;

    public ChatResult() {
    }

    public ChatResult(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}


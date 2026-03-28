package com.example.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "AI问答请求")
public class ChatRequest {

    @NotBlank(message = "question 不能为空")
    @Schema(description = "用户提问", example = "凶手认识死者吗？")
    private String question;

    @Valid
    @NotNull(message = "story 不能为空")
    @Schema(description = "故事对象")
    private Story story;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Story getStory() {
        return story;
    }

    public void setStory(Story story) {
        this.story = story;
    }

    public static class Story {
        @NotBlank(message = "story.id 不能为空")
        @Schema(description = "故事ID", example = "story-001")
        private String id;

        @NotBlank(message = "story.surface 不能为空")
        @Schema(description = "汤面", example = "深夜暴雨，女人听到敲门声后立刻报警。")
        private String surface;

        @NotBlank(message = "story.bottom 不能为空")
        @Schema(description = "汤底", example = "门外的人知道她看不见。")
        private String bottom;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getSurface() {
            return surface;
        }

        public void setSurface(String surface) {
            this.surface = surface;
        }

        public String getBottom() {
            return bottom;
        }

        public void setBottom(String bottom) {
            this.bottom = bottom;
        }
    }
}


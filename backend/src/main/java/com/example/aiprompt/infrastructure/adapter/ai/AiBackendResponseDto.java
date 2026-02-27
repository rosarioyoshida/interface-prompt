package com.example.aiprompt.infrastructure.adapter.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * Represents the response from the AI backend service.
 * Supports OpenAI-compatible response format (choices[].message.content).
 * Adjust fields to match the actual AI backend response shape.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AiBackendResponseDto(
        List<Choice> choices
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Choice(AiMessage message) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AiMessage(String role, String content) {}

    public String extractContent() {
        if (choices == null || choices.isEmpty()) {
            return "";
        }
        Choice first = choices.get(0);
        if (first.message() == null) {
            return "";
        }
        return first.message().content() != null ? first.message().content() : "";
    }
}

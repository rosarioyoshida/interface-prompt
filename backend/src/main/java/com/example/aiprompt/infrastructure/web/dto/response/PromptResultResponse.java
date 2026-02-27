package com.example.aiprompt.infrastructure.web.dto.response;

import java.util.UUID;

public record PromptResultResponse(
        UUID conversationId,
        MessageResponse userMessage,
        MessageResponse assistantMessage
) {}

package com.example.aiprompt.infrastructure.web.dto.response;

import java.util.List;
import java.util.UUID;

public record ConversationResponse(
        UUID id,
        String status,
        List<MessageResponse> messages,
        String createdAt
) {}

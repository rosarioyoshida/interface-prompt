package com.example.aiprompt.infrastructure.web.dto.response;

import java.util.UUID;

public record MessageResponse(
        UUID id,
        String role,
        String content,
        String timestamp
) {}

package com.example.aiprompt.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Message(
        UUID id,
        MessageRole role,
        String content,
        Instant timestamp
) {
    public static Message of(MessageRole role, String content) {
        if (role == null) {
            throw new IllegalArgumentException("Role must not be null");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content must not be blank");
        }
        return new Message(UUID.randomUUID(), role, content.trim(), Instant.now());
    }
}

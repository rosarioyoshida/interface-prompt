package com.example.aiprompt.domain.exception;

import java.util.UUID;

public class ConversationNotFoundException extends RuntimeException {

    private final UUID conversationId;

    public ConversationNotFoundException(UUID conversationId) {
        super("Conversa com ID '" + conversationId + "' não foi encontrada.");
        this.conversationId = conversationId;
    }

    public UUID getConversationId() {
        return conversationId;
    }
}

package com.example.aiprompt.domain.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class Conversation {

    private final UUID id;
    private final Instant createdAt;
    private final List<Message> messages;

    private Conversation(UUID id, Instant createdAt, List<Message> messages) {
        this.id = id;
        this.createdAt = createdAt;
        this.messages = new ArrayList<>(messages);
    }

    public static Conversation create() {
        return new Conversation(UUID.randomUUID(), Instant.now(), Collections.emptyList());
    }

    public UUID getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<Message> getMessages() {
        return Collections.unmodifiableList(messages);
    }

    public ConversationStatus getStatus() {
        return messages.isEmpty() ? ConversationStatus.EMPTY : ConversationStatus.ACTIVE;
    }

    public void addMessagePair(Message userMessage, Message assistantMessage) {
        if (userMessage == null || userMessage.role() != MessageRole.USER) {
            throw new IllegalArgumentException("First message must be a USER message");
        }
        if (assistantMessage == null || assistantMessage.role() != MessageRole.ASSISTANT) {
            throw new IllegalArgumentException("Second message must be an ASSISTANT message");
        }
        messages.add(userMessage);
        messages.add(assistantMessage);
    }
}

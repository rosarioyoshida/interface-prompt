package com.example.aiprompt.domain.port;

import com.example.aiprompt.domain.model.Conversation;

import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository {

    Optional<Conversation> findById(UUID id);

    Conversation save(Conversation conversation);

    void delete(UUID id);
}

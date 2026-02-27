package com.example.aiprompt.application.usecase;

import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class GetConversationUseCase {

    private final ConversationRepository repository;

    public GetConversationUseCase(ConversationRepository repository) {
        this.repository = repository;
    }

    public Conversation execute(UUID conversationId) {
        return repository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));
    }
}

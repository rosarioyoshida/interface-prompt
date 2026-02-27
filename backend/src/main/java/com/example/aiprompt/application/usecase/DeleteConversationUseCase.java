package com.example.aiprompt.application.usecase;

import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DeleteConversationUseCase {

    private final ConversationRepository repository;

    public DeleteConversationUseCase(ConversationRepository repository) {
        this.repository = repository;
    }

    public void execute(UUID conversationId) {
        repository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));
        repository.delete(conversationId);
    }
}

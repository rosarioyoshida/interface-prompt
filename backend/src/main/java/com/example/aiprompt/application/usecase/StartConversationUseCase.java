package com.example.aiprompt.application.usecase;

import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.springframework.stereotype.Component;

@Component
public class StartConversationUseCase {

    private final ConversationRepository repository;

    public StartConversationUseCase(ConversationRepository repository) {
        this.repository = repository;
    }

    public Conversation execute() {
        Conversation conversation = Conversation.create();
        return repository.save(conversation);
    }
}

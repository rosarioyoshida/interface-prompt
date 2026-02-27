package com.example.aiprompt.application.usecase;

import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.model.Message;
import com.example.aiprompt.domain.model.MessageRole;
import com.example.aiprompt.domain.port.AiGateway;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SendPromptUseCase {

    private final ConversationRepository repository;
    private final AiGateway aiGateway;

    public SendPromptUseCase(ConversationRepository repository, AiGateway aiGateway) {
        this.repository = repository;
        this.aiGateway = aiGateway;
    }

    public Conversation execute(UUID conversationId, String promptContent) {
        Conversation conversation = repository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));

        Message userMessage = Message.of(MessageRole.USER, promptContent);
        String aiResponse = aiGateway.complete(conversation.getMessages(), promptContent);
        Message assistantMessage = Message.of(MessageRole.ASSISTANT, aiResponse);

        conversation.addMessagePair(userMessage, assistantMessage);
        return repository.save(conversation);
    }
}

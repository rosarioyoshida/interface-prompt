package com.example.aiprompt.application.usecase;

import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import com.example.aiprompt.domain.exception.AiGatewayException;
import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.model.Message;
import com.example.aiprompt.domain.model.MessageRole;
import com.example.aiprompt.domain.port.AiGateway;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SendPromptUseCase {
    private static final int MAX_PROMPT_LENGTH = 4096;

    private final ConversationRepository repository;
    private final AiGateway aiGateway;

    public SendPromptUseCase(ConversationRepository repository, AiGateway aiGateway) {
        this.repository = repository;
        this.aiGateway = aiGateway;
    }

    public Conversation execute(UUID conversationId, String promptContent) {
        String normalizedPrompt = normalizePrompt(promptContent);

        Conversation conversation = repository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));

        Message userMessage = Message.of(MessageRole.USER, normalizedPrompt);
        String aiResponse = aiGateway.complete(conversation.getMessages(), normalizedPrompt);
        if (aiResponse == null || aiResponse.isBlank()) {
            throw new AiGatewayException("AI backend returned blank content");
        }
        Message assistantMessage = Message.of(MessageRole.ASSISTANT, aiResponse);

        conversation.addMessagePair(userMessage, assistantMessage);
        return repository.save(conversation);
    }

    private String normalizePrompt(String promptContent) {
        if (promptContent == null) {
            throw new IllegalArgumentException("O prompt não pode estar vazio.");
        }

        String trimmed = promptContent.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("O prompt não pode estar vazio.");
        }
        if (trimmed.length() > MAX_PROMPT_LENGTH) {
            throw new IllegalArgumentException(
                    "O prompt não pode exceder " + MAX_PROMPT_LENGTH + " caracteres."
            );
        }
        return trimmed;
    }
}

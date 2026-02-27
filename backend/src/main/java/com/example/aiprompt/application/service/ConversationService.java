package com.example.aiprompt.application.service;

import com.example.aiprompt.application.usecase.DeleteConversationUseCase;
import com.example.aiprompt.application.usecase.GetConversationUseCase;
import com.example.aiprompt.application.usecase.SendPromptUseCase;
import com.example.aiprompt.application.usecase.StartConversationUseCase;
import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.infrastructure.web.assembler.ConversationModelAssembler;
import com.example.aiprompt.infrastructure.web.dto.response.ConversationResponse;
import com.example.aiprompt.infrastructure.web.dto.response.MessageResponse;
import com.example.aiprompt.infrastructure.web.dto.response.PromptResultResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ConversationService {

    private final StartConversationUseCase startConversationUseCase;
    private final SendPromptUseCase sendPromptUseCase;
    private final GetConversationUseCase getConversationUseCase;
    private final DeleteConversationUseCase deleteConversationUseCase;
    private final ConversationModelAssembler assembler;

    public ConversationService(
            StartConversationUseCase startConversationUseCase,
            SendPromptUseCase sendPromptUseCase,
            GetConversationUseCase getConversationUseCase,
            DeleteConversationUseCase deleteConversationUseCase,
            ConversationModelAssembler assembler
    ) {
        this.startConversationUseCase = startConversationUseCase;
        this.sendPromptUseCase = sendPromptUseCase;
        this.getConversationUseCase = getConversationUseCase;
        this.deleteConversationUseCase = deleteConversationUseCase;
        this.assembler = assembler;
    }

    public EntityModel<ConversationResponse> startConversation() {
        Conversation conversation = startConversationUseCase.execute();
        return assembler.toModel(conversation);
    }

    public PromptResultResponse sendPrompt(UUID conversationId, String content) {
        Conversation conversation = sendPromptUseCase.execute(conversationId, content);
        int size = conversation.getMessages().size();

        MessageResponse userMsg = toMessageResponse(conversation, size - 2);
        MessageResponse assistantMsg = toMessageResponse(conversation, size - 1);

        return new PromptResultResponse(conversation.getId(), userMsg, assistantMsg);
    }

    public EntityModel<ConversationResponse> getConversation(UUID conversationId) {
        Conversation conversation = getConversationUseCase.execute(conversationId);
        return assembler.toModel(conversation);
    }

    public void deleteConversation(UUID conversationId) {
        deleteConversationUseCase.execute(conversationId);
    }

    private MessageResponse toMessageResponse(Conversation conversation, int index) {
        var message = conversation.getMessages().get(index);
        return new MessageResponse(
                message.id(),
                message.role().name(),
                message.content(),
                message.timestamp().toString()
        );
    }
}

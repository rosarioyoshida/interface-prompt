package com.example.aiprompt.application.usecase;

import com.example.aiprompt.domain.exception.AiGatewayException;
import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.port.AiGateway;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SendPromptUseCaseValidationTest {

    private ConversationRepository repository;
    private AiGateway aiGateway;
    private SendPromptUseCase useCase;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ConversationRepository.class);
        aiGateway = Mockito.mock(AiGateway.class);
        useCase = new SendPromptUseCase(repository, aiGateway);
    }

    @Test
    void shouldRejectPromptLongerThanLimit() {
        UUID conversationId = UUID.randomUUID();
        Conversation conversation = Conversation.create();
        when(repository.findById(conversationId)).thenReturn(Optional.of(conversation));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(conversationId, "a".repeat(4097))
        );

        assertEquals("O prompt não pode exceder 4096 caracteres.", exception.getMessage());
        verify(repository, never()).save(any());
        verify(aiGateway, never()).complete(any(), any());
    }

    @Test
    void shouldRejectBlankAiResponseBeforePersisting() {
        UUID conversationId = UUID.randomUUID();
        Conversation conversation = Conversation.create();
        when(repository.findById(conversationId)).thenReturn(Optional.of(conversation));
        when(aiGateway.complete(any(), eq("Prompt válido"))).thenReturn("   ");

        assertThrows(
                AiGatewayException.class,
                () -> useCase.execute(conversationId, "  Prompt válido ")
        );

        verify(repository, never()).save(any());
    }

    @Test
    void shouldFailWhenConversationDoesNotExist() {
        UUID conversationId = UUID.randomUUID();
        when(repository.findById(conversationId)).thenReturn(Optional.empty());

        assertThrows(
                ConversationNotFoundException.class,
                () -> useCase.execute(conversationId, "teste")
        );
    }
}

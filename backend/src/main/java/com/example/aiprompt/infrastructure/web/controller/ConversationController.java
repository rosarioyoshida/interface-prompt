package com.example.aiprompt.infrastructure.web.controller;

import com.example.aiprompt.application.service.ConversationService;
import com.example.aiprompt.infrastructure.web.dto.request.SendPromptRequest;
import com.example.aiprompt.infrastructure.web.dto.response.ConversationResponse;
import com.example.aiprompt.infrastructure.web.dto.response.PromptResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/v1/conversations")
@Tag(name = "Conversations", description = "Conversation management endpoints")
public class ConversationController {

    private final ConversationService service;

    public ConversationController(ConversationService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Start a new conversation")
    public ResponseEntity<EntityModel<ConversationResponse>> startConversation() {
        EntityModel<ConversationResponse> model = service.startConversation();
        ConversationResponse body = model.getContent();
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(body != null ? body.id() : "")
                .toUri();
        return ResponseEntity.created(location).body(model);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get conversation by ID with full message history")
    public ResponseEntity<EntityModel<ConversationResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getConversation(id));
    }

    @PostMapping("/{id}/prompts")
    @Operation(summary = "Send a prompt and receive AI response")
    public ResponseEntity<PromptResultResponse> sendPrompt(
            @PathVariable UUID id,
            @Valid @RequestBody SendPromptRequest request
    ) {
        PromptResultResponse result = service.sendPrompt(id, request.content());
        return ResponseEntity.status(201).body(result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete conversation and clear history")
    public ResponseEntity<Void> deleteConversation(@PathVariable UUID id) {
        service.deleteConversation(id);
        return ResponseEntity.noContent().build();
    }
}

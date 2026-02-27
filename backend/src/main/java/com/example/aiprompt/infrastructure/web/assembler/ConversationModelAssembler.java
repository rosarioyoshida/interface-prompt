package com.example.aiprompt.infrastructure.web.assembler;

import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.model.ConversationStatus;
import com.example.aiprompt.domain.model.MessageRole;
import com.example.aiprompt.infrastructure.web.controller.ConversationController;
import com.example.aiprompt.infrastructure.web.dto.response.ConversationResponse;
import com.example.aiprompt.infrastructure.web.dto.response.MessageResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ConversationModelAssembler
        implements RepresentationModelAssembler<Conversation, EntityModel<ConversationResponse>> {

    @Override
    public EntityModel<ConversationResponse> toModel(Conversation conversation) {
        ConversationResponse response = toDto(conversation);
        EntityModel<ConversationResponse> model = EntityModel.of(response);

        model.add(linkTo(methodOn(ConversationController.class)
                .getById(conversation.getId())).withSelfRel());

        model.add(linkTo(methodOn(ConversationController.class)
                .sendPrompt(conversation.getId(), null)).withRel("send-prompt"));

        model.add(linkTo(methodOn(ConversationController.class)
                .startConversation()).withRel("new"));

        if (conversation.getStatus() == ConversationStatus.ACTIVE) {
            model.add(linkTo(methodOn(ConversationController.class)
                    .deleteConversation(conversation.getId())).withRel("clear"));
        }

        return model;
    }

    public ConversationResponse toDto(Conversation conversation) {
        List<MessageResponse> messages = conversation.getMessages().stream()
                .map(m -> new MessageResponse(
                        m.id(),
                        m.role().name(),
                        m.content(),
                        m.timestamp().toString()
                ))
                .toList();

        return new ConversationResponse(
                conversation.getId(),
                conversation.getStatus().name(),
                messages,
                conversation.getCreatedAt().toString()
        );
    }
}

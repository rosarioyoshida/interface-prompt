package com.example.aiprompt.infrastructure.adapter.persistence;

import com.example.aiprompt.domain.model.Conversation;
import com.example.aiprompt.domain.port.ConversationRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryConversationRepository implements ConversationRepository {

    private final ConcurrentHashMap<UUID, Conversation> store = new ConcurrentHashMap<>();

    @Override
    public Optional<Conversation> findById(UUID id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Conversation save(Conversation conversation) {
        store.put(conversation.getId(), conversation);
        return conversation;
    }

    @Override
    public void delete(UUID id) {
        store.remove(id);
    }
}

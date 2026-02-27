package com.example.aiprompt.infrastructure.adapter.ai;

import com.example.aiprompt.domain.model.Message;
import com.example.aiprompt.domain.port.AiGateway;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("mock")
public class EchoAiGatewayAdapter implements AiGateway {

    @Override
    public String complete(List<Message> history, String newPrompt) {
        return "[Echo] " + newPrompt;
    }
}

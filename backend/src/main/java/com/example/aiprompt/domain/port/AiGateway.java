package com.example.aiprompt.domain.port;

import com.example.aiprompt.domain.exception.AiGatewayException;
import com.example.aiprompt.domain.model.Message;

import java.util.List;

public interface AiGateway {

    String complete(List<Message> history, String newPrompt) throws AiGatewayException;
}

package com.example.aiprompt.infrastructure.adapter.ai;

import com.example.aiprompt.domain.exception.AiGatewayException;
import com.example.aiprompt.domain.model.Message;
import com.example.aiprompt.domain.port.AiGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Component
@Primary
@Profile("!mock")
public class HttpAiGatewayAdapter implements AiGateway {

    private static final Logger log = LoggerFactory.getLogger(HttpAiGatewayAdapter.class);

    private final RestClient restClient;

    public HttpAiGatewayAdapter(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public String complete(List<Message> history, String newPrompt) throws AiGatewayException {
        List<Map<String, String>> messages = history.stream()
                .map(m -> Map.of("role", m.role().name().toLowerCase(), "content", m.content()))
                .collect(java.util.stream.Collectors.toList());

        messages.add(Map.of("role", "user", "content", newPrompt));

        Map<String, Object> requestBody = Map.of("messages", messages);

        try {
            AiBackendResponseDto response = restClient
                    .post()
                    .body(requestBody)
                    .retrieve()
                    .body(AiBackendResponseDto.class);

            if (response == null) {
                throw new AiGatewayException("AI backend returned empty response");
            }

            String content = response.extractContent();
            if (content.isBlank()) {
                log.warn("AI backend returned blank content");
                throw new AiGatewayException("AI backend returned blank content");
            }
            return content;

        } catch (RestClientException ex) {
            log.error("AI backend request failed", ex);
            throw new AiGatewayException("AI backend request failed: " + ex.getMessage(), ex);
        }
    }
}

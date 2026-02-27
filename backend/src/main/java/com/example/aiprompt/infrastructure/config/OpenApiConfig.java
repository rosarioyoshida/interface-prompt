package com.example.aiprompt.infrastructure.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "AI Prompt API",
                version = "1.0",
                description = "Interface REST para envio de prompts a um backend de IA. " +
                        "Suporta criação de conversas, envio de prompts, histórico de mensagens e gerenciamento de sessão."
        )
)
public class OpenApiConfig {
}

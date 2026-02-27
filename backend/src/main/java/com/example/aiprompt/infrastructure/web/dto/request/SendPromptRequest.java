package com.example.aiprompt.infrastructure.web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendPromptRequest(
        @NotBlank(message = "O prompt não pode estar vazio.")
        @Size(min = 1, max = 4096, message = "O prompt não pode exceder 4096 caracteres.")
        String content
) {}

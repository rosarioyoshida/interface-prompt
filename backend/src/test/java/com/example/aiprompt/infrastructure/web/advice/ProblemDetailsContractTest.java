package com.example.aiprompt.infrastructure.web.advice;

import com.example.aiprompt.application.service.ConversationService;
import com.example.aiprompt.infrastructure.web.controller.ConversationController;
import com.example.aiprompt.infrastructure.web.filter.TraceIdFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ConversationController.class)
@Import({GlobalExceptionHandler.class, TraceIdFilter.class})
class ProblemDetailsContractTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ConversationService conversationService;

    @Test
    void shouldReturnRfc9457ForInvalidPathVariable() throws Exception {
        mockMvc.perform(get("/v1/conversations/not-a-uuid")
                        .header("X-Trace-Id", "trace-path-01"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(header().string("X-Trace-Id", "trace-path-01"))
                .andExpect(jsonPath("$.type").value("https://api.promptui.local/problems/invalid-parameter"))
                .andExpect(jsonPath("$.title").value("Parâmetro inválido"))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").exists())
                .andExpect(jsonPath("$.instance").value("/v1/conversations/not-a-uuid"))
                .andExpect(jsonPath("$.traceId").value("trace-path-01"))
                .andExpect(jsonPath("$.errors[0].location").value("path"));
    }

    @Test
    void shouldReturnRfc9457ForInvalidPromptPayload() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        String body = """
                {
                  "content": "   "
                }
                """;

        mockMvc.perform(post("/v1/conversations/{id}/prompts", id)
                        .header("X-Trace-Id", "trace-body-01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(header().string("X-Trace-Id", "trace-body-01"))
                .andExpect(jsonPath("$.type").value("https://api.promptui.local/problems/validation-error"))
                .andExpect(jsonPath("$.title").value("Erro de validação"))
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.instance").value("/v1/conversations/" + id + "/prompts"))
                .andExpect(jsonPath("$.traceId").value("trace-body-01"))
                .andExpect(jsonPath("$.errors[0].location").value("body"));
    }
}

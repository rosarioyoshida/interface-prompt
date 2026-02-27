package com.example.aiprompt.infrastructure.web.advice;

import com.example.aiprompt.domain.exception.AiGatewayException;
import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String BASE_TYPE = "https://api.promptui.local/problems";

    @ExceptionHandler(ConversationNotFoundException.class)
    public ResponseEntity<ExtendedProblemDetail> handleNotFound(ConversationNotFoundException ex) {
        log.warn("Conversation not found: {}", ex.getConversationId());
        ExtendedProblemDetail detail = ExtendedProblemDetail.of(HttpStatus.NOT_FOUND);
        detail.setType(URI.create(BASE_TYPE + "/not-found"));
        detail.setTitle("Recurso não encontrado");
        detail.setDetail(ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }

    @ExceptionHandler(AiGatewayException.class)
    public ResponseEntity<ExtendedProblemDetail> handleAiGateway(AiGatewayException ex) {
        log.error("AI gateway error", ex);
        ExtendedProblemDetail detail = ExtendedProblemDetail.of(HttpStatus.SERVICE_UNAVAILABLE);
        detail.setType(URI.create(BASE_TYPE + "/ai-gateway-unavailable"));
        detail.setTitle("Serviço de IA Indisponível");
        detail.setDetail("O serviço de inteligência artificial está temporariamente indisponível. Tente novamente em instantes.");
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExtendedProblemDetail> handleValidation(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<ExtendedProblemDetail.FieldError> fieldErrors = bindingResult.getFieldErrors().stream()
                .map(fe -> new ExtendedProblemDetail.FieldError(
                        fe.getField(),
                        fe.getDefaultMessage(),
                        "body",
                        fe.getCode() != null ? fe.getCode().toUpperCase() : "INVALID"
                ))
                .toList();

        ExtendedProblemDetail detail = ExtendedProblemDetail.of(HttpStatus.UNPROCESSABLE_ENTITY);
        detail.setType(URI.create(BASE_TYPE + "/validation-error"));
        detail.setTitle("Erro de Validação");
        detail.setDetail("Um ou mais campos possuem valores inválidos.");
        detail.setErrors(fieldErrors);

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExtendedProblemDetail> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        ExtendedProblemDetail detail = ExtendedProblemDetail.of(HttpStatus.INTERNAL_SERVER_ERROR);
        detail.setType(URI.create(BASE_TYPE + "/internal-error"));
        detail.setTitle("Erro Interno");
        detail.setDetail("Ocorreu um erro inesperado. Por favor, tente novamente.");
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }
}

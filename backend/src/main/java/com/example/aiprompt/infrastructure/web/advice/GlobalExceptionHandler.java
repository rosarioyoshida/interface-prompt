package com.example.aiprompt.infrastructure.web.advice;

import com.example.aiprompt.domain.exception.AiGatewayException;
import com.example.aiprompt.domain.exception.ConversationNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String BASE_TYPE = "https://api.promptui.local/problems";

    @ExceptionHandler(ConversationNotFoundException.class)
    public ResponseEntity<ExtendedProblemDetail> handleNotFound(
            ConversationNotFoundException ex,
            HttpServletRequest request
    ) {
        log.warn("Conversation not found: {}", ex.getConversationId());
        ExtendedProblemDetail detail = problem(
                HttpStatus.NOT_FOUND,
                "not-found",
                "Recurso não encontrado",
                ex.getMessage(),
                request
        );
        return response(HttpStatus.NOT_FOUND, detail);
    }

    @ExceptionHandler(AiGatewayException.class)
    public ResponseEntity<ExtendedProblemDetail> handleAiGateway(
            AiGatewayException ex,
            HttpServletRequest request
    ) {
        log.error("AI gateway error", ex);
        ExtendedProblemDetail detail = problem(
                HttpStatus.SERVICE_UNAVAILABLE,
                "ai-gateway-unavailable",
                "Serviço de IA indisponível",
                "O serviço de inteligência artificial está temporariamente indisponível. Tente novamente em instantes.",
                request
        );
        return response(HttpStatus.SERVICE_UNAVAILABLE, detail);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        BindingResult bindingResult = ex.getBindingResult();
        List<ExtendedProblemDetail.FieldError> fieldErrors = bindingResult.getFieldErrors().stream()
                .map(fe -> new ExtendedProblemDetail.FieldError(
                        fe.getField(),
                        fe.getDefaultMessage(),
                        "body",
                        fe.getCode() != null ? fe.getCode().toUpperCase() : "INVALID"
                ))
                .toList();

        HttpServletRequest servletRequest = ((ServletWebRequest) request).getRequest();
        ExtendedProblemDetail detail = problem(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "validation-error",
                "Erro de validação",
                "Um ou mais campos possuem valores inválidos.",
                servletRequest
        );
        detail.setErrors(fieldErrors);

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }

    @Override
    protected ResponseEntity<Object> handleTypeMismatch(
            TypeMismatchException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        HttpServletRequest servletRequest = ((ServletWebRequest) request).getRequest();
        String parameterName = ex instanceof MethodArgumentTypeMismatchException mismatch
                ? mismatch.getName()
                : "param";
        String message = "Parâmetro '" + parameterName + "' possui formato inválido.";

        ExtendedProblemDetail detail = problem(
                HttpStatus.BAD_REQUEST,
                "invalid-parameter",
                "Parâmetro inválido",
                message,
                servletRequest
        );
        detail.setErrors(List.of(
                new ExtendedProblemDetail.FieldError(parameterName, message, "path", "TYPE_MISMATCH")
        ));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        HttpServletRequest servletRequest = ((ServletWebRequest) request).getRequest();
        ExtendedProblemDetail detail = problem(
                HttpStatus.BAD_REQUEST,
                "malformed-request",
                "Requisição malformada",
                "Não foi possível interpretar o corpo da requisição.",
                servletRequest
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ExtendedProblemDetail> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request
    ) {
        List<ExtendedProblemDetail.FieldError> fieldErrors = ex.getConstraintViolations().stream()
                .map(violation -> new ExtendedProblemDetail.FieldError(
                        violation.getPropertyPath().toString(),
                        violation.getMessage(),
                        "query",
                        "CONSTRAINT_VIOLATION"
                ))
                .toList();

        ExtendedProblemDetail detail = problem(
                HttpStatus.BAD_REQUEST,
                "constraint-violation",
                "Parâmetros inválidos",
                "Um ou mais parâmetros da requisição são inválidos.",
                request
        );
        detail.setErrors(fieldErrors);
        return response(HttpStatus.BAD_REQUEST, detail);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExtendedProblemDetail> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        ExtendedProblemDetail detail = problem(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "validation-error",
                "Erro de validação",
                ex.getMessage(),
                request
        );
        detail.setErrors(List.of(
                new ExtendedProblemDetail.FieldError("content", ex.getMessage(), "body", "INVALID_INPUT")
        ));
        return response(HttpStatus.UNPROCESSABLE_ENTITY, detail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExtendedProblemDetail> handleGeneral(
            Exception ex,
            HttpServletRequest request
    ) {
        log.error("Unexpected error", ex);
        ExtendedProblemDetail detail = problem(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "internal-error",
                "Erro interno",
                "Ocorreu um erro inesperado. Por favor, tente novamente.",
                request
        );
        return response(HttpStatus.INTERNAL_SERVER_ERROR, detail);
    }

    private ExtendedProblemDetail problem(
            HttpStatus status,
            String typeSuffix,
            String title,
            String detailMessage,
            HttpServletRequest request
    ) {
        ExtendedProblemDetail detail = ExtendedProblemDetail.of(status);
        detail.setType(URI.create(BASE_TYPE + "/" + typeSuffix));
        detail.setTitle(title);
        detail.setDetail(detailMessage);
        detail.setInstance(URI.create(request.getRequestURI()));
        return detail;
    }

    private ResponseEntity<ExtendedProblemDetail> response(
            HttpStatus status,
            ExtendedProblemDetail detail
    ) {
        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(detail);
    }
}

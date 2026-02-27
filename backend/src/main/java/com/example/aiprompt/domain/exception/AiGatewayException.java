package com.example.aiprompt.domain.exception;

public class AiGatewayException extends RuntimeException {

    public AiGatewayException(String message, Throwable cause) {
        super(message, cause);
    }

    public AiGatewayException(String message) {
        super(message);
    }
}

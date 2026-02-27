package com.example.aiprompt.infrastructure.web.advice;

import org.slf4j.MDC;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;

import java.util.List;

public class ExtendedProblemDetail extends ProblemDetail {

    private String traceId;
    private List<FieldError> errors;

    protected ExtendedProblemDetail(HttpStatusCode status) {
        super(status.value());
        this.traceId = MDC.get("traceId");
    }

    public static ExtendedProblemDetail of(HttpStatusCode status) {
        return new ExtendedProblemDetail(status);
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public List<FieldError> getErrors() {
        return errors;
    }

    public void setErrors(List<FieldError> errors) {
        this.errors = errors;
    }

    public record FieldError(String name, String reason, String location, String code) {}
}

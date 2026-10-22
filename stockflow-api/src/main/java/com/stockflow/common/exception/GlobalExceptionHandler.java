
package com.stockflow.common.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    
@ExceptionHandler(
    org.springframework.web.server.ResponseStatusException.class
)
public ResponseEntity<ApiError> handleResponseStatus(
        org.springframework.web.server.ResponseStatusException ex) {

    HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

    return build(
        status,
        ex.getReason() == null ? status.getReasonPhrase() : ex.getReason(),
        Map.of()
    );
}


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            ResourceNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicate(
            DuplicateResourceException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.putIfAbsent(
                error.getField(),
                error.getDefaultMessage() == null
                    ? "Invalid value"
                    : error.getDefaultMessage()
            )
        );

        return build(
            HttpStatus.BAD_REQUEST,
            "Validation failed",
            errors
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(
            ConstraintViolationException ex) {
        return build(
            HttpStatus.BAD_REQUEST,
            "Invalid request parameters",
            Map.of()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(
            IllegalArgumentException ex) {
        return build(
            HttpStatus.BAD_REQUEST,
            ex.getMessage() == null ? "Invalid request" : ex.getMessage(),
            Map.of()
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableRequest(
            HttpMessageNotReadableException ex) {
        return build(
            HttpStatus.BAD_REQUEST,
            "Invalid request body or data format",
            Map.of()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDatabaseConflict(
            DataIntegrityViolationException ex) {
        return build(
            HttpStatus.CONFLICT,
            "The request conflicts with existing data",
            Map.of()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex) {
        return build(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred",
            Map.of()
        );
    }

    private ResponseEntity<ApiError> build(
            HttpStatus status,
            String message,
            Map<String, String> validationErrors) {

        ApiError body = new ApiError(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            validationErrors
        );

        return ResponseEntity.status(status).body(body);
    }
}

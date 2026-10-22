
package com.stockflow.auth.dto;

import com.stockflow.user.Role;

import java.util.UUID;

public record AuthResponse(
    String token,
    String tokenType,
    UUID userId,
    String email,
    Role role
) {}

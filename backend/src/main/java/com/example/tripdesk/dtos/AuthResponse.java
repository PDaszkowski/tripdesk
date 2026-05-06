package com.example.tripdesk.dtos;

import com.example.tripdesk.enums.UserRole;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String email,
        String firstName,
        String lastName,
        UserRole role
) {}
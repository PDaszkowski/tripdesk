package com.example.tripdesk.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record RegisterRequest(
        @NotBlank(message = "Email is obligatory")
        @Email(message = "Wrong email format")
        String email,

        @NotBlank(message = "Password is obligatory")
        @Size(min = 8, message = "Password has to contain at least 8 symbols")
        String password,

        @NotBlank(message = "Name is obligatory")
        String firstName,

        @NotBlank(message = "Surname is obligatory")
        String lastName,

        String phoneNumber,
        String role,


        String agencyName,
        String agencyNip,

        String passportNumber,
        String passportExpiry
) {}
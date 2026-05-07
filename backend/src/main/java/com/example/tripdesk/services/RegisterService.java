package com.example.tripdesk.services;

import com.example.tripdesk.dtos.RegisterRequest;
import com.example.tripdesk.model.*;
import com.example.tripdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(RegisterRequest request) {
        User user;

        switch (request.role().toUpperCase()) {
            case "ADMIN" -> {
                Admin admin = new Admin();
                admin.setAgencyName(request.agencyName());
                admin.setAgencyNip(request.agencyNip());
                user = admin;
            }
            case "AGENT" -> {
                user = new Agent();
            }
            case "CLIENT" -> {
                Client client = new Client();
                client.setPassportNumber(request.passportNumber());
                if (request.passportExpiry() != null && !request.passportExpiry().isEmpty()) {
                    client.setPassportExpiry(LocalDate.parse(request.passportExpiry()));
                }
                user = client;
            }
            default -> throw new IllegalArgumentException("Unknown role: " + request.role());
        }

        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setRole(com.example.tripdesk.enums.UserRole.valueOf(request.role().toUpperCase()));
        user.setActive(true);

        user.setPassword(passwordEncoder.encode(request.password()));

        return userRepository.save(user);
    }
}
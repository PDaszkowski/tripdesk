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

        switch (request.getRole().toUpperCase()) {
            case "ADMIN" -> {
                Admin admin = new Admin();
                admin.setAgencyName(request.getAgencyName());
                admin.setAgencyNip(request.getAgencyNip());
                user = admin;
            }
            case "AGENT" -> {
                user = new Agent();
            }
            case "CLIENT" -> {
                Client client = new Client();
                client.setPassportNumber(request.getPassportNumber());
                if (request.getPassportExpiry() != null && !request.getPassportExpiry().isEmpty()) {
                    client.setPassportExpiry(LocalDate.parse(request.getPassportExpiry()));
                }
                user = client;
            }
            default -> throw new IllegalArgumentException("Nieznana rola: " + request.getRole());
        }

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(com.example.tripdesk.enums.UserRole.valueOf(request.getRole().toUpperCase()));
        user.setActive(true);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }
}
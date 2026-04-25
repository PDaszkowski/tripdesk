package com.example.tripdesk.controllers;

import com.example.tripdesk.dtos.LoginRequest;
import com.example.tripdesk.model.User;
import com.example.tripdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Sprawdzamy czy podane hasło pasuje do zaszyfrowanego w bazie
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                // Na tym etapie zwracamy obiekt usera (bez hasła najlepiej, ale dla testów może być)
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Błędny email lub hasło");
    }
}
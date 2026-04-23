package com.example.tripdesk.controllers;

import com.example.tripdesk.dtos.RegisterRequest;
import com.example.tripdesk.model.User;
import com.example.tripdesk.services.RegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegisterController {

    private final RegisterService registerService;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = registerService.registerUser(request);
            return ResponseEntity.ok("User " + registeredUser.getEmail() + " has been registered successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
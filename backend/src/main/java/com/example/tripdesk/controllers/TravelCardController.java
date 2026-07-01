package com.example.tripdesk.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/travel-card")
public class TravelCardController {
    @GetMapping
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Dostęp przyznany! Autoryzacja działa.");
    }


}

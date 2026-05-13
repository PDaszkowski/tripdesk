package com.example.tripdesk.controllers;

import com.example.tripdesk.services.TripSyncService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/trips")
@RequiredArgsConstructor
public class AdminTripController {

    private final TripSyncService tripSyncService;

    @Operation(summary = "Pobierz ofertę z Duffel i dodaj do niej zdjęcie z Unsplash")
    @PostMapping("/sync")
    public ResponseEntity<String> syncTrip(
            @RequestParam(defaultValue = "WAW") String origin,
            @RequestParam(defaultValue = "CDG") String destination,
            @RequestParam String departureDate // format: YYYY-MM-DD
    ) {
        tripSyncService.generateTripOffer(origin, destination, departureDate);
        return ResponseEntity.ok("Zrobione! Oferta połączyła się z obu API i zapisała w bazie.");
    }
}
package com.example.tripdesk.controllers;

import com.example.tripdesk.model.Trip;
import com.example.tripdesk.repositories.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TripController {

    private final TripRepository tripRepository;

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        // Pobieramy wszystkie wycieczki zapisane w bazie przez TripSyncService
        List<Trip> trips = tripRepository.findAll();
        return ResponseEntity.ok(trips);
    }
}
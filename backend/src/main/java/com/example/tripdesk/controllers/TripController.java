package com.example.tripdesk.controllers;

import com.example.tripdesk.model.Trip;
import com.example.tripdesk.repositories.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TripController {

    private final TripRepository tripRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return tripRepository.findById(id)
                .map(trip -> ResponseEntity.ok(trip))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Trip> getAllTrips(@RequestParam(required = false) String country) {
        if (country != null && !country.isEmpty()) {
            return tripRepository.findByCountryIgnoreCase(country);
        }
        return tripRepository.findAll();
    }
}
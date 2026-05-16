package com.example.tripdesk.controllers;

import com.example.tripdesk.dtos.ReservationRequest;
import com.example.tripdesk.model.Reservation;
import com.example.tripdesk.model.Trip;
import com.example.tripdesk.repositories.ReservationRepository;
import com.example.tripdesk.repositories.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final TripRepository tripRepository;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        Trip trip = tripRepository.findById(request.tripId())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wycieczki"));

        // WALIDACJA 1: Czy lista osób zgadza się z licznikiem
        if (request.participants() == null || request.participants().size() != request.numberOfPeople()) {
            return ResponseEntity.badRequest().body("Liczba uczestników musi zgadzać się z wybraną liczbą osób.");
        }

        // WALIDACJA 2: Czy nie przekroczono limitu wycieczki
        if (request.numberOfPeople() > trip.getMaxPeople()) {
            return ResponseEntity.badRequest().body("Przekroczono limit miejsc.");
        }

        BigDecimal finalPrice = trip.getPrice().multiply(new BigDecimal(request.numberOfPeople()));

        Reservation reservation = Reservation.builder()
                .trip(trip)
                .numberOfPeople(request.numberOfPeople())
                .participants(request.participants()) // Zapisujemy listę osób
                .totalPrice(finalPrice)
                .contactName(request.contactName())
                .contactEmail(request.contactEmail())
                .contactPhone(request.contactPhone())
                .status("NEW")
                .build();

        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }
}
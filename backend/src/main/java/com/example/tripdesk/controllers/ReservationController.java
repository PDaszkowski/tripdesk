package com.example.tripdesk.controllers;

import com.example.tripdesk.model.Reservation;
import com.example.tripdesk.model.Trip;
import com.example.tripdesk.model.User;
import com.example.tripdesk.repositories.ReservationRepository;
import com.example.tripdesk.repositories.TripRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final TripRepository tripRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public record ReservationRequest(
            Long tripId,
            Integer numberOfPeople,
            String contactName,
            String contactEmail,
            String contactPhone,
            List<String> participants
    ) {}

    public record TripSummary(
            Long id,
            String destinationCity,
            String hotelName,
            String imageUrl,
            String country,
            java.time.LocalDateTime departureTime,
            java.time.LocalDateTime returnDepartureTime
    ) {}

    public record ReservationResponse(
            Long id,
            String status,
            Integer numberOfPeople,
            java.math.BigDecimal totalPrice,
            LocalDateTime createdAt,
            String contactName,
            String contactEmail,
            String contactPhone,
            List<String> participants,
            TripSummary trip
    ) {}

    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody ReservationRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Stripe.apiKey = stripeApiKey.trim();

        Trip trip = tripRepository.findById(request.tripId())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wycieczki o id " + request.tripId()));

        BigDecimal finalPrice = trip.getPrice().multiply(BigDecimal.valueOf(request.numberOfPeople()));

        Reservation reservation = Reservation.builder()
                .trip(trip)
                .user(currentUser)
                .numberOfPeople(request.numberOfPeople())
                .contactName(request.contactName())
                .contactEmail(request.contactEmail())
                .contactPhone(request.contactPhone())
                .participants(request.participants())
                .totalPrice(finalPrice)
                .createdAt(LocalDateTime.now())
                .status("PENDING")
                .build();

        reservationRepository.save(reservation);

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:3000/my-trips?payment_success=true")
                    .setCancelUrl("http://localhost:3000/trips/" + request.tripId())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("pln")
                                                    .setUnitAmount(finalPrice.multiply(BigDecimal.valueOf(100)).longValue())
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Wycieczka: " + trip.getDestinationCity())
                                                                    .setDescription("Hotel: " + trip.getHotelName() + " (uczestnicy: " + request.numberOfPeople() + ")")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .putMetadata("reservationId", reservation.getId().toString())
                    .build();

            Session session = Session.create(params);
            return ResponseEntity.ok(Map.of("checkoutUrl", session.getUrl()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd integracji płatności Stripe: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal User currentUser
    ) {
        List<Reservation> reservations = reservationRepository.findByUserOrderByCreatedAtDesc(currentUser);

        List<ReservationResponse> response = reservations.stream().map(r -> new ReservationResponse(
                r.getId(),
                r.getStatus(),
                r.getNumberOfPeople(),
                r.getTotalPrice(),
                r.getCreatedAt(),
                r.getContactName(),
                r.getContactEmail(),
                r.getContactPhone(),
                r.getParticipants(),
                new TripSummary(
                        r.getTrip().getId(),
                        r.getTrip().getDestinationCity(),
                        r.getTrip().getHotelName(),
                        r.getTrip().getImageUrl(),
                        r.getTrip().getCountry(),
                        r.getTrip().getDepartureTime(),
                        r.getTrip().getReturnDepartureTime()
                )
        )).toList();

        return ResponseEntity.ok(response);
    }
}
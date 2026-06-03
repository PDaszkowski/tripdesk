package com.example.tripdesk.controllers;

import com.example.tripdesk.model.Reservation;
import com.example.tripdesk.repositories.ReservationRepository;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookController.class);
    private final ReservationRepository reservationRepository;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(
            HttpServletRequest request,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        Event event;

        try {
            byte[] payloadBytes = request.getInputStream().readAllBytes();
            String payload = new String(payloadBytes, StandardCharsets.UTF_8);

            log.info("Webhook secret (pierwsze 10 znaków): {}", webhookSecret.substring(0, 10));
            log.info("Sig header (pierwsze 20 znaków): {}", sigHeader.substring(0, 20));
            log.info("Payload length: {}", payload.length());

            event = Webhook.constructEvent(payload, sigHeader, webhookSecret.trim());
        } catch (Exception e) {
            log.error("Nieprawidłowy podpis Webhooka: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błąd podpisu.");
        }

        log.info("Odebrano webhook Stripe o typie: {}", event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

            log.info("Deserializer present: {}", dataObjectDeserializer.getObject().isPresent());

            if (dataObjectDeserializer.getObject().isPresent()) {
                Session session = (Session) dataObjectDeserializer.getObject().get();
                String reservationIdStr = session.getMetadata().get("reservationId");
                updateReservationStatus(reservationIdStr);
            } else {
                // Fallback dla nowych wersji API Stripe — parsujemy raw JSON
                log.warn("Deserializer niedostępny, parsowanie raw JSON...");
                try {
                    String rawJson = event.getData().toJson();
                    // Szukamy "reservationId" w metadanych
                    com.google.gson.JsonObject dataObj = com.google.gson.JsonParser.parseString(rawJson)
                            .getAsJsonObject();
                    com.google.gson.JsonObject metadata = dataObj
                            .getAsJsonObject("object")
                            .getAsJsonObject("metadata");
                    if (metadata != null && metadata.has("reservationId")) {
                        String reservationIdStr = metadata.get("reservationId").getAsString();
                        updateReservationStatus(reservationIdStr);
                    } else {
                        log.error("Brak reservationId w metadanych raw JSON");
                    }
                } catch (Exception e) {
                    log.error("Błąd parsowania raw JSON: {}", e.getMessage());
                }
            }
        }

        return ResponseEntity.ok("Odebrano pomyślnie.");
    }

    private void updateReservationStatus(String reservationIdStr) {
        if (reservationIdStr == null) {
            log.error("ReservationId jest NULL!");
            return;
        }
        Long reservationId = Long.parseLong(reservationIdStr);
        log.info("Aktualizacja rezerwacji ID: {} na PAID", reservationId);

        reservationRepository.findById(reservationId).ifPresentOrElse(
                reservation -> {
                    reservation.setStatus("PAID");
                    reservationRepository.save(reservation);
                    log.info("Status rezerwacji {} zaktualizowany na PAID", reservationId);
                },
                () -> log.error("Nie znaleziono rezerwacji: {}", reservationId)
        );
    }
}
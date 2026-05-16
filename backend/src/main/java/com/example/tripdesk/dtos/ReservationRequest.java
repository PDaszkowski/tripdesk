package com.example.tripdesk.dtos;
import java.util.List;

public record ReservationRequest(
        Long tripId,
        Integer numberOfPeople,
        String contactName,    // Płatnik
        String contactEmail,   // Płatnik
        String contactPhone,   // Płatnik
        List<String> participants // Lista imion i nazwisk (np. ["Jan Kowalski", "Anna Kowalska"])
) {}
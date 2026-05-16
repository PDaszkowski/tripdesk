package com.example.tripdesk.dtos.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DuffelRequest(RequestData data) {
    public record RequestData(
            List<Slice> slices,
            List<Passenger> passengers
    ) {}

    public record Slice(
            String origin,
            String destination,
            String departure_date
    ) {}

    public record Passenger(
            String type
    ) {}
}
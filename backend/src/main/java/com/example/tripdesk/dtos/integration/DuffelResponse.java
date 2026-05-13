package com.example.tripdesk.dtos.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DuffelResponse(ResponseData data) {
    public record ResponseData(List<Offer> offers) {}
    public record Offer(String total_amount, String total_currency, List<SliceResponse> slices) {}
    public record SliceResponse(String duration, List<Segment> segments) {}
    public record Segment(String departing_at, String arriving_at, Origin origin, Destination destination) {}
    public record Origin(String iata_code, String city_name) {}
    public record Destination(String iata_code, String city_name) {}
}
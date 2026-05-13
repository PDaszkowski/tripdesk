package com.example.tripdesk.dtos;

public record TripDetails(
        String hotelName,
        String description,
        String attractions,
        Integer maxPersons
) {}

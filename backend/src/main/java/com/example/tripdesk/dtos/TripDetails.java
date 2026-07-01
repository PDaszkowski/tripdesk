package com.example.tripdesk.dtos;

import java.util.List;

public record TripDetails(
        String hotelName,
        String description,
        List<String> attractions,
        Integer maxPeople,
        String boardBasis,
        Boolean hasParking,
        String country
) {}

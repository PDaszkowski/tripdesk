package com.example.tripdesk.services;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class PricingService {
    private static final Map<String, Double> DESTINATION_MULTIPLIERS = Map.of(
            "DXB", 3.5, // Dubaj
            "HNL", 3.0, // Honolulu
            "CDG", 2.0, // Paryż
            "WAW", 1.0, // Warszawa
            "BOM", 0.7  // Bombaj
    );

    public BigDecimal calculateHotelPrice(String iataCode, long days, String boardBasis) {
        double basePricePerNight = 200.0; // Bazowa cena za dobę
        double cityMultiplier = DESTINATION_MULTIPLIERS.getOrDefault(iataCode, 1.2);

        double boardMultiplier = switch (boardBasis.toLowerCase()) {
            case "all inclusive" -> 2.5;
            case "dwa posiłki" -> 1.6;
            default -> 1.0; // Tylko śniadania
        };

        double total = (basePricePerNight * cityMultiplier * boardMultiplier) * days;
        return BigDecimal.valueOf(total).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}

package com.example.tripdesk.services;

import com.example.tripdesk.dtos.TripDetails;
import com.example.tripdesk.dtos.integration.DuffelRequest;
import com.example.tripdesk.dtos.integration.DuffelResponse;
import com.example.tripdesk.model.Trip;
import com.example.tripdesk.repositories.TripRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TripSyncService {

    private final UnsplashService unsplashService;
    private final TripRepository tripRepository;
    private final RestClient restClient;
    private final String duffelToken;
    private final ObjectMapper objectMapper;
    private final AIService aiService;

    public TripSyncService(
            UnsplashService unsplashService,
            TripRepository tripRepository,
            AIService aiService, // Dodaj do konstruktora
            @Value("${duffel.api.token}") String duffelToken,
            ObjectMapper objectMapper
    ) {
        this.unsplashService = unsplashService;
        this.tripRepository = tripRepository;
        this.aiService = aiService;
        this.duffelToken = duffelToken;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.create("https://api.duffel.com");
        // ChatClient.Builder nie jest już tu potrzebny!
    }

    public void generateTripOffer(String origin, String destination, String departureDate) {
        // 1. DUFFEL: Pobranie lotu
        var requestBody = new DuffelRequest(new DuffelRequest.RequestData(
                List.of(new DuffelRequest.Slice(origin, destination, departureDate)),
                List.of(new DuffelRequest.Passenger("adult"))
        ));

        DuffelResponse response = restClient.post()
                .uri("/air/offer_requests")
                .header("Authorization", "Bearer " + duffelToken)
                .header("Duffel-Version", "v2")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(DuffelResponse.class);

        if (response == null || response.data().offers().isEmpty()) {
            throw new RuntimeException("Brak lotów.");
        }

        var offer = response.data().offers().get(0);
        var segment = offer.slices().get(0).segments().get(0);
        String cityName = segment.destination().city_name();

        // 2. UNSPLASH: Pobranie zdjęcia
        String imageUrl = unsplashService.getCityPhotoUrl(cityName);

        // 3. OLLAMA AI: Generowanie kreatywnych detali
        String aiPrompt = """
            Jesteś agentem biura podróży. Dla miasta %s wygeneruj dane w formacie JSON (tylko JSON!):
            {
              "hotel": "Nazwa luksusowego hotelu",
              "description": "Krótki, epicki opis wycieczki (2 zdania)",
              "attractions": "3 największe atrakcje po przecinku",
              "maxPersons": 2
            }
            Użyj języka polskiego.
            """.formatted(cityName);

        TripDetails details = aiService.generateTripDetails(cityName);
        System.out.println("AI wygenerowało: " + details);

        try {

            // 4. ZAPIS DO BAZY
            Trip trip = Trip.builder()
                    .destinationCity(cityName)
                    .destinationCode(segment.destination().iata_code())
                    .originCode(segment.origin().iata_code())
                    .price(new BigDecimal(offer.total_amount()))
                    .departureTime(LocalDateTime.parse(segment.departing_at().substring(0, 19)))
                    .arrivalTime(LocalDateTime.parse(segment.arriving_at().substring(0, 19)))
                    .imageUrl(imageUrl)
                    .hotelName(details.hotelName())
                    .description(details.description())
                    .attractions(details.attractions())
                    .maxPersons(details.maxPersons())
                    .build();

            tripRepository.save(trip);
        } catch (Exception e) {
            throw new RuntimeException("Błąd AI: " + e.getMessage());
        }
    }
}
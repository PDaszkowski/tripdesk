package com.example.tripdesk.services;

import com.example.tripdesk.dtos.TripDetails;
import com.example.tripdesk.dtos.integration.DuffelRequest;
import com.example.tripdesk.dtos.integration.DuffelResponse;
import com.example.tripdesk.model.Trip;
import com.example.tripdesk.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripSyncService {

    private final UnsplashService unsplashService;
    private final TripRepository tripRepository;
    private final RestClient restClient;
    private final String duffelToken;
    private final AIService aiService;
    private final PricingService pricingService;

    public TripSyncService(
            UnsplashService unsplashService,
            TripRepository tripRepository,
            AIService aiService,
            PricingService pricingService,
            @Value("${duffel.api.token}") String duffelToken
    ) {
        this.unsplashService = unsplashService;
        this.tripRepository = tripRepository;
        this.aiService = aiService;
        this.pricingService = pricingService;
        this.duffelToken = duffelToken;
        this.restClient = RestClient.create("https://api.duffel.com");
    }

    public void generateTripOffer(String origin, String destination, String departureDate, String returnDate) {

        // 1. DUFFEL: Pobranie lotu w obie strony
        var requestBody = new DuffelRequest(new DuffelRequest.RequestData(
                List.of(
                        new DuffelRequest.Slice(origin, destination, departureDate),
                        new DuffelRequest.Slice(destination, origin, returnDate)
                ),
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
            throw new RuntimeException("Brak lotów dla podanych dat.");
        }

        // Pobieramy pierwszą (zazwyczaj najtańszą) ofertę
        var offer = response.data().offers().get(0);

        // Analiza lotu TAM (Outbound)
        var outboundSlice = offer.slices().get(0);
        var outboundSegments = outboundSlice.segments();
        var firstOutboundSegment = outboundSegments.get(0);
        var lastOutboundSegment = outboundSegments.get(outboundSegments.size() - 1);

        // Analiza lotu POWROTNEGO (Inbound) - bierzemy pierwszy segment, żeby znać czas startu powrotu
        var firstInboundSegment = offer.slices().get(1).segments().get(0);

        // Prawdziwy cel to ostatni przystanek lotu tam
        String cityName = lastOutboundSegment.destination().city_name();

        // Logika przesiadek
        String stopOverInfo = null;
        if (outboundSegments.size() > 1) {
            var stopCity = firstOutboundSegment.destination().city_name();
            var stopIata = firstOutboundSegment.destination().iata_code();
            stopOverInfo = "Przesiadka: " + stopCity + " (" + stopIata + ")";
        }

        // 2. OBLICZENIE CZASU TRWANIA (DNI)
        // Wykorzystujemy czas wylotu z pierwszego segmentu i czas powrotu
        LocalDateTime depTime = LocalDateTime.parse(firstOutboundSegment.departing_at().substring(0, 19));
        LocalDateTime retTime = LocalDateTime.parse(firstInboundSegment.departing_at().substring(0, 19));

        long days = java.time.temporal.ChronoUnit.DAYS.between(depTime, retTime);
        if (days <= 0) days = 1;

        // 3. UNSPLASH i AI
        String imageUrl = unsplashService.getCityPhotoUrl(cityName);
        TripDetails details = aiService.generateTripDetails(cityName);

        // Pobieramy zdjęcia dla 4 atrakcji (nazwy są po angielsku dzięki nowemu promptowi)
        List<String> attractionUrls = unsplashService.getAttractionPhotos(String.join(", ", details.attractions()));

        // 4. PRICING
        BigDecimal flightPrice = new BigDecimal(offer.total_amount());
        BigDecimal hotelPrice = pricingService.calculateHotelPrice(destination, days, details.boardBasis());
        BigDecimal totalPrice = flightPrice.add(hotelPrice);

        try {
            // 5. ZAPIS DO BAZY
            Trip trip = Trip.builder()
                    .destinationCity(cityName)
                    .country(details.country())
                    .destinationCode(lastOutboundSegment.destination().iata_code())
                    .originCode(firstOutboundSegment.origin().iata_code())
                    .stopOverInfo(stopOverInfo)
                    .price(totalPrice)
                    .flightPrice(flightPrice)
                    .hotelPrice(hotelPrice)
                    .departureTime(depTime)
                    .arrivalTime(LocalDateTime.parse(lastOutboundSegment.arriving_at().substring(0, 19)))
                    .returnDepartureTime(retTime)
                    .durationDays((int) days)
                    .imageUrl(imageUrl)
                    .hotelName(details.hotelName())
                    .description(details.description())
                    .attractions(String.join(", ", details.attractions()))
                    .maxPeople(details.maxPeople())
                    .boardBasis(details.boardBasis())
                    .hasParking(details.hasParking())
                    .outboundDuration(outboundSlice.duration())
                    .attractionImageUrls(attractionUrls)
                    .build();

            tripRepository.save(trip);
            System.out.println("Zapisano kompletną ofertę dla: " + cityName + " (Kraj: " + details.country() + ")");
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas zapisu wycieczki: " + e.getMessage());
        }
    }
}
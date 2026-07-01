package com.example.tripdesk.services;

import com.example.tripdesk.dtos.TripDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AIService {
    private static final Logger log = LoggerFactory.getLogger(AIService.class);
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AIService(ChatClient.Builder builder, ObjectMapper objectMapper) {
        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public TripDetails generateTripDetails(String city) {
        OllamaOptions options = OllamaOptions.builder()
                .temperature(0.2)
                .numPredict(1000)
                .build();

        log.info("Generowanie oferty dla miasta: {}", city);

        // 1. Pobieramy odpowiedź jako String
        String response = chatClient.prompt()
                .system("""
                Jesteś agentem biura podróży. Zwróć WYŁĄCZNIE surowy JSON.
                ZASADY JĘZYKOWE:
                - Pola 'description', 'boardBasis' mają być w JĘZYKU POLSKIM.
                - Pole 'attractions' musi zawierać dokładnie 4 pozycje i muszą być w JĘZYKU ANGIELSKIM (nazwy własne).
                - Pole 'country' i 'hotelName' w JĘZYKU POLSKIM.
                
                STRUKTURA JSON:
                {
                  "hotelName": "...",
                  "description": "...",
                  "attractions": ["Nazwa 1", "Nazwa 2", "Nazwa 3", "Nazwa 4"],
                  "maxPeople": 8,
                  "boardBasis": "...",
                  "hasParking": true/false,
                  "country": "..."
                }
                """)
                .user("Przygotuj ofertę dla miasta: " + city)
                .call()
                .content();

        // 2. Logika naprawcza
        if (response == null || response.isEmpty()) {
            throw new RuntimeException("AI zwróciło pustą odpowiedź");
        }

        response = response.trim();

        // POPRAWKA 2: Bardziej elastyczny regex, który usuwa zarówno ```json, jak i samo ```
        if (response.startsWith("```")) {
            response = response.replaceAll("^```(json)?", "").replaceAll("```$", "").trim();
        }

        // Jeśli brakuje klamry zamykającej - dodaj ją
        if (!response.endsWith("}")) {
            log.warn("Wykryto niekompletny JSON, próbuję naprawić...");
            response += "}";
        }

        // 3. Parsowanie na obiekt
        try {
            return objectMapper.readValue(response, TripDetails.class);
        } catch (Exception e) {
            log.error("Błąd parsowania JSON. Surowy tekst: {}", response);
            throw new RuntimeException("Nie udało się sparsować oferty biura podróży", e);
        }
    }
}
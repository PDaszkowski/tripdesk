package com.example.tripdesk.services;

import com.example.tripdesk.dtos.TripDetails;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;


@Service
public class AIService {
    private final ChatClient chatClient;

    public AIService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public TripDetails generateTripDetails(String city) {
        // Tworzymy opcje ręcznie, aby uniknąć problemów z builderem
        var options = new org.springframework.ai.ollama.api.OllamaOptions();
        options.setTemperature(0.3);  // Trochę wyższa niż 0.1, żeby opisy były ładniejsze
        options.setNumPredict(1000);   // Zapas na długie, malownicze opisy

        return chatClient.prompt()
                .system("""
                Jesteś profesjonalnym copywriterem w biurze podróży. 
                Twoim zadaniem jest stworzenie kuszącego opisu wycieczki.
                
                WYMAGANIA:
                1. Opis (description) musi być malowniczy, zachęcający i składać się z minimum 3 rozbudowanych zdań.
                2. Używaj barwnego języka, pisz o emocjach i lokalnym klimacie.
                3. Zwróć dane WYŁĄCZNIE jako JSON.
                4. Klucze w JSON: "hotelName", "description", "attractions", "maxPersons".
                """)
                .user("Przygotuj ofertę dla miasta: " + city)
                .options(options)
                .call()
                .entity(TripDetails.class);
    }
}
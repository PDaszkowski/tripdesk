package com.example.tripdesk.services;

import com.example.tripdesk.dtos.integration.UnsplashResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class UnsplashService {

    private final RestClient restClient;
    private final String accessKey;

    public UnsplashService(@Value("${unsplash.api.key}") String accessKey) {
        this.accessKey = accessKey;
        this.restClient = RestClient.create("https://api.unsplash.com");
    }

    public String getCityPhotoUrl(String cityName) {
        try {
            UnsplashResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search/photos")
                            .queryParam("query", cityName + " city landmark")
                            .queryParam("per_page", 1)
                            .build())
                    .header("Authorization", "Client-ID " + accessKey)
                    .retrieve()
                    .body(UnsplashResponse.class);

            if (response != null && !response.results().isEmpty()) {
                return response.results().get(0).urls().regular();
            }
        } catch (Exception e) {
            System.err.println("Błąd pobierania zdjęcia: " + e.getMessage());
        }
        return "https://images.unsplash.com/photo-1436491865332-7a61a109cc05";
    }
}
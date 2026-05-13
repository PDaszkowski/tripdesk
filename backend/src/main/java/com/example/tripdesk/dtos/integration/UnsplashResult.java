package com.example.tripdesk.dtos.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UnsplashResult(UnsplashUrls urls) {}

package com.example.tripdesk.dtos.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UnsplashResponse(List<UnsplashResult> results) {}

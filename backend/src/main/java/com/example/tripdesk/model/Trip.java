package com.example.tripdesk.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originCode;
    private String destinationCode;
    private String destinationCity;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String outboundDuration;

    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String hotelName;

    @Column(columnDefinition = "TEXT")
    private String attractions;

    private Integer maxPersons;
}
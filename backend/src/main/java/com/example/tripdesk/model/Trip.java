package com.example.tripdesk.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    private Integer maxPeople;

    private LocalDateTime returnDepartureTime;
    private Integer durationDays;
    private String boardBasis;
    private Boolean hasParking;
    private BigDecimal flightPrice;
    private BigDecimal hotelPrice;

    @ElementCollection
    @CollectionTable(name = "trip_attraction_images", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "image_url")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<String> attractionImageUrls;

    public String country;

    private String stopOverInfo;
}
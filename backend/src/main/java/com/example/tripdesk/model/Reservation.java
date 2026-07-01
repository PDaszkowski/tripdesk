package com.example.tripdesk.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    private Integer numberOfPeople;
    private BigDecimal totalPrice;

    // Dane z formularza od frontendu
    private String contactName;
    private String contactEmail;
    private String contactPhone;

    // np. "NEW", "CONFIRMED", "CANCELLED"
    private String status;

    @ElementCollection
    @CollectionTable(name = "reservation_participants", joinColumns = @JoinColumn(name = "reservation_id"))
    @Column(name = "participant_name")
    private List<String> participants;

    private LocalDateTime createdAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "NEW";
        }
    }
}
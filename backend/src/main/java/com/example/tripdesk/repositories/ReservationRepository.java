package com.example.tripdesk.repositories;

import com.example.tripdesk.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
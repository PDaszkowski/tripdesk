package com.example.tripdesk.repositories;

import com.example.tripdesk.model.Reservation;
import com.example.tripdesk.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserOrderByCreatedAtDesc(User user);
}
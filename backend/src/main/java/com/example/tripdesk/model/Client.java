package com.example.tripdesk.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collection;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table()
    public class Client extends User {

        private String firstName;
        private String lastName;
        private String phone;
        private String passportNumber;
        private LocalDate passportExpiry;

        @Column(columnDefinition = "TEXT")
        private String preferences;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
        }
    }


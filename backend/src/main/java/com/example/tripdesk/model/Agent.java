package com.example.tripdesk.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collection;
import java.util.List;
import java.util.ArrayList;

@Entity
@DiscriminatorValue("AGENT")
@Getter
@Setter
@NoArgsConstructor
public class Agent extends User {

    @OneToMany(mappedBy = "agent", fetch = FetchType.LAZY)
    private List<Client> clients = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_AGENT"));
    }
}
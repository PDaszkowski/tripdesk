package com.example.tripdesk.services;

import com.example.tripdesk.dtos.AuthResponse;
import com.example.tripdesk.dtos.LoginRequest;
import com.example.tripdesk.dtos.RefreshRequest;
import com.example.tripdesk.model.User;
import com.example.tripdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RedisTokenService redisTokenService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        redisTokenService.saveRefreshToken(user.getEmail(), refreshToken);
        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );

    }

    public void logout(String accessToken, String email) {
        // dodanie access token do blacklisty
        // ttl = czas, który pozostał do wygaśnięcia tokenu
        long ttl = jwtService.getExpirationTime(accessToken) - System.currentTimeMillis();
        redisTokenService.blacklistToken(accessToken, ttl);

        // usunięcie refresh tokena z Redisa
        redisTokenService.deleteRefreshToken(accessToken);
    }

    public AuthResponse refresh(RefreshRequest request) {
        String token = request.refreshToken();

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid token");
        }

        String email = jwtService.extractEmail(token);

        if (!redisTokenService.isRefreshTokenValid(token, email)) {
            throw new RuntimeException("Token expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        redisTokenService.saveRefreshToken(email, newRefreshToken);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );
    }
}

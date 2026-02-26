package com.inscribe.backend.auth;

import com.inscribe.backend.auth.dto.*;
import com.inscribe.backend.common.exception.BadRequestException;
import com.inscribe.backend.common.exception.UnauthorizedException;
import com.inscribe.backend.config.JwtProperties;
import com.inscribe.backend.security.CustomUserDetails;
import com.inscribe.backend.security.JwtService;
import com.inscribe.backend.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail().split("@")[0]);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return generateAuthResponse(user);
    }

    public AuthResponse login(AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        return generateAuthResponse(user);
    }

    public AuthResponse refreshToken(String requestToken) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(requestToken)
                .orElseThrow(() ->
                        new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token expired");
        }

        User user = refreshToken.getUser();

        // ROTATION — delete old
        refreshTokenRepository.delete(refreshToken);

        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {

        String accessToken = jwtService.generateAccessToken(
                new CustomUserDetails(user)
        );

        String refreshTokenValue = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(refreshTokenValue);
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(
                LocalDateTime.now().plusSeconds(
                        jwtProperties.getRefreshTokenExpiration() / 1000
                )
        );

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .user(user)
                .build();
    }
}

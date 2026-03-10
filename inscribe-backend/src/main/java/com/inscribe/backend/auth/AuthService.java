package com.inscribe.backend.auth;

import com.inscribe.backend.auth.dto.AuthRequest;
import com.inscribe.backend.auth.dto.AuthResponse;
import com.inscribe.backend.auth.dto.SignupRequest;
import com.inscribe.backend.common.exception.BadRequestException;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.common.exception.UnauthorizedException;
import com.inscribe.backend.config.JwtProperties;
import com.inscribe.backend.security.CustomUserDetails;
import com.inscribe.backend.security.JwtService;
import com.inscribe.backend.user.Role;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import com.inscribe.backend.user.dto.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_DEVICE_ID = "web-default";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(normalizedEmail);
        user.setUsername(generateUniqueUsername(normalizedEmail));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return generateAuthResponse(user, DEFAULT_DEVICE_ID);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return generateAuthResponse(user, DEFAULT_DEVICE_ID);
    }

    @Transactional
    public AuthResponse refreshToken(String requestToken, String deviceId) {

        refreshTokenRepository.deleteExpiredTokens();

        String tokenHash = hashToken(requestToken);

        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenHashAndRevokedFalse(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            throw new UnauthorizedException("Refresh token expired");
        }

        if (!refreshToken.getDeviceId().equals(deviceId)) {
            throw new UnauthorizedException("Invalid device binding");
        }

        refreshToken.setRevoked(true);

        return generateAuthResponse(refreshToken.getUser(), deviceId);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.revokeByTokenHash(hashToken(refreshToken));
    }

    private AuthResponse generateAuthResponse(User user, String deviceId) {

        refreshTokenRepository.revokeActiveTokensByUserAndDevice(user.getId(), deviceId);

        String accessToken = jwtService.generateAccessToken(new CustomUserDetails(user));

        String refreshTokenValue = UUID.randomUUID() + "." + UUID.randomUUID();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(hashToken(refreshTokenValue));
        refreshToken.setDeviceId(deviceId);
        refreshToken.setUser(user);
        refreshToken.setRevoked(false);
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshToken.setExpiryDate(
                LocalDateTime.now().plusSeconds(jwtProperties.getRefreshTokenExpiration() / 1000)
        );

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .user(mapToUserResponse(user))
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .build();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash refresh token", ex);
        }
    }

    private String generateUniqueUsername(String email) {
        String[] parts = email.split("@");
        String base = parts.length > 0 ? parts[0] : "user";
        base = base.replaceAll("[^a-zA-Z0-9_.-]", "").toLowerCase();
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }

        return candidate;
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }
}

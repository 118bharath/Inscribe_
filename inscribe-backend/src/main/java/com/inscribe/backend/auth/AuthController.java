package com.inscribe.backend.auth;

import com.inscribe.backend.auth.dto.*;
import com.inscribe.backend.security.SecurityConfig;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public AuthResponse signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody AuthRequest request
    ) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(
            @RequestBody RefreshRequest request
    ) {
        return authService.refreshToken(request.getRefreshToken());
    }
}
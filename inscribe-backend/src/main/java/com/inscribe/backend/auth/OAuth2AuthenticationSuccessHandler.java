package com.inscribe.backend.auth;

import com.inscribe.backend.auth.dto.AuthResponse;
import com.inscribe.backend.config.OAuthProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final OAuthProperties oauthProperties;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = attribute(oauth2User, "email");
        if (email == null || email.isBlank()) {
            response.sendRedirect(buildFailureRedirect("missing_email"));
            return;
        }

        String name = attribute(oauth2User, "name");
        String picture = attribute(oauth2User, "picture");

        AuthResponse authResponse = authService.authenticateWithGoogle(email, name, picture);
        String fragment = UriComponentsBuilder.newInstance()
                .queryParam("accessToken", authResponse.getAccessToken())
                .queryParam("refreshToken", authResponse.getRefreshToken())
                .queryParam("id", authResponse.getUser().getId())
                .queryParam("username", authResponse.getUser().getUsername())
                .queryParam("name", authResponse.getUser().getName())
                .queryParamIfPresent("avatar", java.util.Optional.ofNullable(authResponse.getUser().getAvatar()))
                .build()
                .encode()
                .getQuery();

        response.sendRedirect(
                UriComponentsBuilder.fromUriString(oauthProperties.getSuccessRedirectUrl())
                        .fragment(fragment)
                        .build(true)
                        .toUriString()
        );
    }

    private String buildFailureRedirect(String errorCode) {
        return UriComponentsBuilder.fromUriString(oauthProperties.getFailureRedirectUrl())
                .queryParam("error", errorCode)
                .build()
                .encode()
                .toUriString();
    }

    private String attribute(OAuth2User oauth2User, String attributeName) {
        Object value = oauth2User.getAttributes().get(attributeName);
        return value == null ? null : value.toString();
    }
}

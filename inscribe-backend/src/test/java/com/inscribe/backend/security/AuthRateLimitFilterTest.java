package com.inscribe.backend.security;

import com.inscribe.backend.service.RateLimiterService;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AuthRateLimitFilterTest {

    @Test
    void shouldReturnTooManyRequestsWhenThresholdExceeded() throws ServletException, IOException {
        RateLimiterService rateLimiterService = mock(RateLimiterService.class);
        when(rateLimiterService.isAllowed(anyString())).thenReturn(false);
        AuthRateLimitFilter filter = new AuthRateLimitFilter(rateLimiterService);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/posts");
        request.setRemoteAddr("127.0.0.1");
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());

        assertThat(response.getStatus()).isEqualTo(429);
    }

    @Test
    void shouldSkipAuthenticationEndpoints() throws ServletException, IOException {
        RateLimiterService rateLimiterService = mock(RateLimiterService.class);
        AuthRateLimitFilter filter = new AuthRateLimitFilter(rateLimiterService);

        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr("127.0.0.1");
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());

        verifyNoInteractions(rateLimiterService);
        assertThat(response.getStatus()).isNotEqualTo(429);
    }
}

package com.inscribe.backend.security;

import com.inscribe.backend.config.RateLimitProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties rateLimitProperties;
    private final Map<String, WindowCounter> counters = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (isLimitedEndpoint(path) && "POST".equalsIgnoreCase(request.getMethod())) {
            String key = request.getRemoteAddr() + ":" + path;
            WindowCounter current = counters.computeIfAbsent(key, ignored -> new WindowCounter());
            long now = Instant.now().getEpochSecond();

            synchronized (current) {
                if (now - current.windowStart >= rateLimitProperties.getAuthWindowSeconds()) {
                    current.windowStart = now;
                    current.count.set(0);
                }
                if (current.count.incrementAndGet() > rateLimitProperties.getMaxAuthAttempts()) {
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Too many authentication attempts\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isLimitedEndpoint(String path) {
        return "/api/auth/login".equals(path) || "/api/auth/refresh".equals(path) || "/api/auth/signup".equals(path);
    }

    private static final class WindowCounter {
        private long windowStart = Instant.now().getEpochSecond();
        private final AtomicInteger count = new AtomicInteger(0);
    }
}

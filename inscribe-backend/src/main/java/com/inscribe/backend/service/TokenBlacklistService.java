package com.inscribe.backend.service;

import com.inscribe.backend.security.JwtService;
import com.inscribe.backend.config.RedisSettingsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private static final String KEY_PREFIX = "auth:blacklist:";

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisService redisService;
    private final JwtService jwtService;
    private final RedisSettingsProperties redisSettingsProperties;

    public void blacklist(String token) {
        if (!redisSettingsProperties.isEnabled()) {
            return;
        }

        long remainingValidityMs = jwtService.getRemainingValidityMillis(token);
        if (remainingValidityMs <= 0) {
            return;
        }

        redisService.run("blacklist_token", () ->
                stringRedisTemplate.opsForValue().set(
                        key(token),
                        "1",
                        Duration.ofMillis(remainingValidityMs)
                )
        );
    }

    public boolean isBlacklisted(String token) {
        if (!redisSettingsProperties.isEnabled()) {
            return false;
        }

        return redisService.execute(
                        "check_blacklisted_token",
                        () -> Boolean.TRUE.equals(stringRedisTemplate.hasKey(key(token)))
                )
                .orElse(false);
    }

    private String key(String token) {
        return KEY_PREFIX + hash(token);
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash JWT token", ex);
        }
    }
}

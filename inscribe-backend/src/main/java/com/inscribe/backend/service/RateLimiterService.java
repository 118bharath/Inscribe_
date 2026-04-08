package com.inscribe.backend.service;

import com.inscribe.backend.config.RedisSettingsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private static final String KEY_PREFIX = "rate_limit:";
    private static final DefaultRedisScript<Long> RATE_LIMIT_SCRIPT = new DefaultRedisScript<>(
            """
            local current = redis.call('INCR', KEYS[1])
            if current == 1 then
              redis.call('EXPIRE', KEYS[1], ARGV[1])
            end
            return current
            """,
            Long.class
    );

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisService redisService;
    private final RedisSettingsProperties redisSettingsProperties;

    public boolean isAllowed(String identifier) {
        if (!redisSettingsProperties.isEnabled()) {
            return true;
        }

        String key = KEY_PREFIX + identifier;
        long windowSeconds = redisSettingsProperties.getRateLimitWindowSeconds();
        long limit = redisSettingsProperties.getRateLimitRequests();

        return redisService.execute(
                        "rate_limit_check",
                        () -> stringRedisTemplate.execute(
                                RATE_LIMIT_SCRIPT,
                                List.of(key),
                                String.valueOf(windowSeconds)
                        )
                )
                .map(count -> count <= limit)
                .orElse(true);
    }
}

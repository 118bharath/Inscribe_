package com.inscribe.backend.config;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.redis")
public class RedisSettingsProperties {

    private boolean enabled = false;

    @Min(1)
    private long blogTtlMinutes = 10;

    @Min(1)
    private int rateLimitRequests = 10;

    @Min(1)
    private long rateLimitWindowSeconds = 60;

    @Min(1000)
    private long likesSyncIntervalMs = 60000;
}

package com.inscribe.backend.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "aws")
public class StorageProperties {

    @NotBlank
    private String region;

    @NotBlank
    private String s3Bucket;

    @Min(1)
    private long maxUploadSizeBytes = 10 * 1024 * 1024;

    @Min(1)
    private long uploadUrlDurationMinutes = 10;

    @Min(1)
    private long viewUrlDurationMinutes = 60;

    @NotEmpty
    private Set<String> allowedContentTypes = new LinkedHashSet<>(
            Set.of("image/png", "image/jpeg", "image/webp")
    );
}

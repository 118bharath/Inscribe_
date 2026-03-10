package com.inscribe.backend.storage.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PresignedUrlRequest {
    @NotBlank
    @Size(max = 255)
    private String fileName;

    @NotBlank
    @Size(max = 100)
    private String contentType;

    @Min(1)
    @Max(10485760)
    private long contentLength;
}


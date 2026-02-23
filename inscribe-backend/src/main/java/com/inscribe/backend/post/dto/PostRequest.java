package com.inscribe.backend.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String excerpt;

    private String status; // DRAFT or PUBLISHED
}
package com.inscribe.backend.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class PostRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String excerpt;

    private String status; // DRAFT or PUBLISHED

    private Set<String> tags;
}
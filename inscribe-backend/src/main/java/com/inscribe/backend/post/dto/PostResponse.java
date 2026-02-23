package com.inscribe.backend.post.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String status;
    private String authorName;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAuthor;
}
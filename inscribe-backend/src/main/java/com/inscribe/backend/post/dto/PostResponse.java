package com.inscribe.backend.post.dto;

import com.inscribe.backend.user.dto.UserResponse;
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
    private UserResponse author;
    private String imageUrl;
    private String category;
    private boolean staffPick;
    private long likeCount;
    private long bookmarkCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAuthor;
}

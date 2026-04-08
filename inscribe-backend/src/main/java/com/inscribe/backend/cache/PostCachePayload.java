package com.inscribe.backend.cache;

import com.inscribe.backend.user.dto.UserResponse;
import lombok.Builder;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

@Value
@Builder
public class PostCachePayload implements Serializable {
    Long id;
    String title;
    String slug;
    String content;
    String excerpt;
    String status;
    String imageUrl;
    String category;
    boolean staffPick;
    Long authorId;
    String authorName;
    UserResponse author;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

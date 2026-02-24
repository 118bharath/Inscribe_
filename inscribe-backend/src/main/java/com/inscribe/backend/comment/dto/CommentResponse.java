package com.inscribe.backend.comment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private Long postId;
    private Long parentId;
    private LocalDateTime createdAt;
    private boolean isAuthor;
}
package com.inscribe.backend.notification.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long id;
    private String message;
    private String type;
    private boolean isRead;
    private Long senderId;
    private String senderName;
    private Long relatedPostId;
    private LocalDateTime createdAt;
}
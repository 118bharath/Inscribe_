package com.inscribe.backend.notification;

import com.inscribe.backend.notification.dto.NotificationResponse;
import com.inscribe.backend.post.Post;
import com.inscribe.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void createNotification(
            User recipient,
            User sender,
            NotificationType type,
            String message,
            Post relatedPost
    ) {

        if (recipient.getId().equals(sender.getId())) {
            return; // don't notify self
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedPost(relatedPost);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);

        NotificationResponse response = map(notification);

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipient.getId(),
                response
        );
    }

    public List<NotificationResponse> getNotifications(Long userId) {
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    private NotificationResponse map(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType().name())
                .isRead(n.isRead())
                .senderId(n.getSender().getId())
                .senderName(n.getSender().getName())
                .relatedPostId(
                        n.getRelatedPost() != null
                                ? n.getRelatedPost().getId()
                                : null
                )
                .createdAt(n.getCreatedAt())
                .build();
    }
}
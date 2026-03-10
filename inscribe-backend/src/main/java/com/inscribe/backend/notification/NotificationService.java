package com.inscribe.backend.notification;

import com.inscribe.backend.notification.dto.NotificationResponse;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.common.exception.UnauthorizedException;
import com.inscribe.backend.post.Post;
import com.inscribe.backend.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/queue/notifications",
                response
        );
    }

    public Page<NotificationResponse> getNotifications(Long userId, int page, int size) {
        int boundedPage = Math.max(page, 0);
        int boundedSize = Math.min(Math.max(size, 1), 50);
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(userId, PageRequest.of(boundedPage, boundedSize))
                .map(this::map);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new UnauthorizedException("Not authorized");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
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

package com.inscribe.backend.notification;

import com.inscribe.backend.notification.dto.NotificationResponse;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/notifications", "/api/notifications"})
@RequiredArgsConstructor
@Validated
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public Page<NotificationResponse> getNotifications(
            Authentication auth,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size
    ) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationService.getNotifications(user.getId(), page, size);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount(Authentication auth) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationService.getUnreadCount(user.getId());
    }

    @PutMapping("/{id}/read")
    public void markAsRead(
            @PathVariable Long id,
            Authentication auth
    ) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        notificationService.markAsRead(id, user.getId());
    }

    @PutMapping("/read-all")
    public void markAllAsRead(Authentication auth) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        notificationService.markAllAsRead(user.getId());
    }
}

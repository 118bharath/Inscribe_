package com.inscribe.backend.notification;

import com.inscribe.backend.notification.dto.NotificationResponse;
import com.inscribe.backend.user.UserService;
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
    private final UserService userService;

    @GetMapping
    public Page<NotificationResponse> getNotifications(
            Authentication auth,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size
    ) {
        return notificationService.getNotifications(userService.getCurrentUserId(auth), page, size);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount(Authentication auth) {
        return notificationService.getUnreadCount(userService.getCurrentUserId(auth));
    }

    @PutMapping("/{id}/read")
    public void markAsRead(
            @PathVariable Long id,
            Authentication auth
    ) {
        notificationService.markAsRead(id, userService.getCurrentUserId(auth));
    }

    @PutMapping("/read-all")
    public void markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(userService.getCurrentUserId(auth));
    }
}

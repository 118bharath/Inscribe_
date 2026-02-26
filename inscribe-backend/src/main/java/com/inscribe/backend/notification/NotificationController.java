package com.inscribe.backend.notification;

import com.inscribe.backend.notification.dto.NotificationResponse;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public List<NotificationResponse> getNotifications(Authentication auth) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow();

        return notificationService.getNotifications(user.getId());
    }
}
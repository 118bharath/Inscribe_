package com.inscribe.backend.user;

import com.inscribe.backend.user.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ProfileResponse getProfile(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return userService.getProfile(id, authentication);
    }
}

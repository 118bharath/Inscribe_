package com.inscribe.backend.follow;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{id}/follow")
    public void follow(
            @PathVariable Long id,
            Authentication authentication
    ) {
        followService.followUser(id, authentication);
    }

    @DeleteMapping("/{id}/follow")
    public void unfollow(
            @PathVariable Long id,
            Authentication authentication
    ) {
        followService.unfollowUser(id, authentication);
    }
}

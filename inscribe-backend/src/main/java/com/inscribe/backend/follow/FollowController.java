package com.inscribe.backend.follow;

import com.inscribe.backend.follow.dto.FollowResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/users", "/api/users"})
@RequiredArgsConstructor
@Validated
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

    @GetMapping("/{id}/followers")
    public List<FollowResponse> getFollowers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "100") @Min(1) @Max(200) int limit
    ) {
        return followService.getFollowers(id, limit);
    }

    @GetMapping("/{id}/following")
    public List<FollowResponse> getFollowing(
            @PathVariable Long id,
            @RequestParam(defaultValue = "100") @Min(1) @Max(200) int limit
    ) {
        return followService.getFollowing(id, limit);
    }
}

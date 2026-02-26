package com.inscribe.backend.user;

import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.follow.FollowService;
import com.inscribe.backend.user.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowService followService;

    public ProfileResponse getProfile(Long userId, Authentication authentication) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long currentUserId = null;
        if (authentication != null) {
            User currentUser = userRepository
                    .findByEmail(authentication.getName())
                    .orElse(null);
            if (currentUser != null) currentUserId = currentUser.getId();
        }

        boolean isFollowing = false;
        if (currentUserId != null) {
            isFollowing = followService.isFollowing(currentUserId, userId);
        }

        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .followersCount(
                        followService.countFollowers(userId)
                )
                .followingCount(
                        followService.countFollowing(userId)
                )
                .isFollowing(isFollowing)
                .isCurrentUser(
                        currentUserId != null &&
                                currentUserId.equals(userId)
                )
                .build();
    }
}

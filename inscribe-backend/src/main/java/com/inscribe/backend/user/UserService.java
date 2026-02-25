package com.inscribe.backend.user;

import com.inscribe.backend.user.dto.ProfileResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    @Transactional
    public void followUser(Long userId, Authentication authentication) {

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Cannot follow yourself");
        }

        boolean exists = followRepository
                .existsByFollowerIdAndFollowingId(currentUser.getId(), userId);

        if (exists) return;

        User targetUser = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Follow follow = new Follow();
        follow.setFollower(currentUser);
        follow.setFollowing(targetUser);

        followRepository.save(follow);
    }

    @Transactional
    public void unfollowUser(Long userId, Authentication authentication) {

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        followRepository.deleteByFollowerIdAndFollowingId(
                currentUser.getId(),
                userId
        );
    }

    public ProfileResponse getProfile(Long userId, Authentication authentication) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long currentUserId = null;
        if (authentication != null) {
            User currentUser = userRepository
                    .findByEmail(authentication.getName())
                    .orElse(null);
            if (currentUser != null) currentUserId = currentUser.getId();
        }

        boolean isFollowing = false;
        if (currentUserId != null) {
            isFollowing = followRepository
                    .existsByFollowerIdAndFollowingId(currentUserId, userId);
        }

        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .followersCount(
                        followRepository.countByFollowingId(userId)
                )
                .followingCount(
                        followRepository.countByFollowerId(userId)
                )
                .isFollowing(isFollowing)
                .isCurrentUser(
                        currentUserId != null &&
                                currentUserId.equals(userId)
                )
                .build();
    }
}
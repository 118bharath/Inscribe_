package com.inscribe.backend.follow;

import com.inscribe.backend.common.exception.BadRequestException;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.notification.NotificationService;
import com.inscribe.backend.notification.NotificationType;
import com.inscribe.backend.follow.dto.FollowResponse;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    @Transactional
    public void followUser(Long userId, Authentication authentication) {

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("Cannot follow yourself");
        }

        boolean exists = followRepository
                .existsByFollowerIdAndFollowingId(currentUser.getId(), userId);

        if (exists) {
            return;
        }

        User targetUser = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Follow follow = new Follow();
        follow.setFollower(currentUser);
        follow.setFollowing(targetUser);

        followRepository.save(follow);

        notificationService.createNotification(
                targetUser,
                currentUser,
                NotificationType.FOLLOW,
                currentUser.getName() + " started following you",
                null
        );
    }

    @Transactional
    public void unfollowUser(Long userId, Authentication authentication) {

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        followRepository.deleteByFollowerIdAndFollowingId(
                currentUser.getId(),
                userId
        );
    }

    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    public long countFollowers(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    public long countFollowing(Long userId) {
        return followRepository.countByFollowerId(userId);
    }

    public List<FollowResponse> getFollowers(Long userId, int limit) {

        ensureUserExists(userId);

        return followRepository.findByFollowingId(userId).stream()
                .limit(limit)
                .map(Follow::getFollower)
                .map(this::mapToUserSummary)
                .toList();
    }

    public List<FollowResponse> getFollowing(Long userId, int limit) {

        ensureUserExists(userId);

        return followRepository.findByFollowerId(userId).stream()
                .limit(limit)
                .map(Follow::getFollowing)
                .map(this::mapToUserSummary)
                .toList();
    }

    private FollowResponse mapToUserSummary(User user) {
        return FollowResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .build();
    }

    private void ensureUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
    }
}

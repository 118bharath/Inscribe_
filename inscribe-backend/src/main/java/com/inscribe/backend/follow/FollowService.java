package com.inscribe.backend.follow;

import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {

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

        if (exists) {
            return;
        }

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

    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    public long countFollowers(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    public long countFollowing(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
}

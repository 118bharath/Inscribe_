package com.inscribe.backend.user;

import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.follow.FollowService;
import com.inscribe.backend.user.dto.ProfileResponse;
import com.inscribe.backend.user.dto.UpdateProfileRequest;
import com.inscribe.backend.user.dto.UserResponse;
import com.inscribe.backend.user.dto.UserSummaryResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Transactional
    public ProfileResponse updateProfile(
            Authentication authentication,
            UpdateProfileRequest request
    ) {

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null) {
            currentUser.setName(request.getName());
        }

        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }

        if (request.getAvatar() != null) {
            currentUser.setAvatar(request.getAvatar());
        }

        User savedUser = userRepository.save(currentUser);
        return getProfile(savedUser.getId(), authentication);
    }

    public Page<UserSummaryResponse> searchUsers(String keyword, int page, int size) {
        int boundedPage = Math.max(page, 0);
        int boundedSize = Math.min(Math.max(size, 1), 50);
        return userRepository.searchUsers(keyword, PageRequest.of(boundedPage, boundedSize))
                .map(this::mapToUserSummary);
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .build();
    }

    private UserSummaryResponse mapToUserSummary(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .build();
    }
}

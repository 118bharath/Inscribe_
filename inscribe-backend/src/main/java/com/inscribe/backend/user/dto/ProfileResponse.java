package com.inscribe.backend.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {

    private Long id;
    private String name;
    private String username;
    private String bio;
    private String avatar;

    private long followersCount;
    private long followingCount;

    private boolean isFollowing;
    private boolean isCurrentUser;
}
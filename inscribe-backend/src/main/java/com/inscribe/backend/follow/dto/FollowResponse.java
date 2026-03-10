package com.inscribe.backend.follow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FollowResponse {

    private Long userId;
    private String username;
    private String avatar;
}

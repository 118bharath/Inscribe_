package com.inscribe.backend.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String name;
    private String bio;
    private String avatar;
}

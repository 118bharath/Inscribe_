package com.inscribe.backend.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryResponse {

    private Long id;
    private String name;
    private String username;
    private String bio;
    private String avatar;
}

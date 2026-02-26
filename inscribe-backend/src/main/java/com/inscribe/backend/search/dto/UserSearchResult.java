package com.inscribe.backend.search.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSearchResult {

    private Long id;
    private String name;
    private String username;
    private String bio;
    private String avatar;
}
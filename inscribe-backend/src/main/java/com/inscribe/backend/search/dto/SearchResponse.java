package com.inscribe.backend.search.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SearchResponse {

    private List<PostSearchResult> posts;
    private List<UserSearchResult> users;

    private long totalPostResults;
    private long totalUserResults;
}
package com.inscribe.backend.search.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostSearchResult {

    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String authorName;
}
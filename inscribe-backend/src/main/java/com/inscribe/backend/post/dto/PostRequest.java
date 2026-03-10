package com.inscribe.backend.post.dto;

import com.inscribe.backend.post.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.util.Set;

@Data
public class PostRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    private String content;

    @Size(max = 1000)
    private String excerpt;

    @NotNull
    private PostStatus status;

    @Size(max = 20)
    private Set<String> tags;

    @URL
    @Size(max = 2000)
    private String imageUrl;

    @Size(max = 100)
    private String category;

    private Boolean staffPick;
}

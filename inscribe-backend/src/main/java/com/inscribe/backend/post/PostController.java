package com.inscribe.backend.post;

import com.inscribe.backend.post.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public PostResponse create(
            @Valid @RequestBody PostRequest request,
            Authentication authentication
    ) {
        return postService.createPost(request, authentication);
    }

    @GetMapping
    public Page<PostResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return postService.getPublishedPosts(page, size);
    }

    @GetMapping("/{slug}")
    public PostResponse getBySlug(
            @PathVariable String slug,
            Authentication authentication
    ) {
        return postService.getPostBySlug(slug, authentication);
    }

    @PutMapping("/{id}")
    public PostResponse update(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            Authentication authentication
    ) {
        return postService.updatePost(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        postService.deletePost(id, authentication);
    }

    @PostMapping("/{id}/clap")
    public void clap(
            @PathVariable Long id,
            Authentication authentication
    ) {
        postService.clapPost(id, authentication);
    }

    @DeleteMapping("/{id}/clap")
    public void unclap(
            @PathVariable Long id,
            Authentication authentication
    ) {
        postService.unclapPost(id, authentication);
    }

    @PostMapping("/{id}/bookmark")
    public void bookmark(
            @PathVariable Long id,
            Authentication authentication
    ) {
        postService.bookmarkPost(id, authentication);
    }

    @DeleteMapping("/{id}/bookmark")
    public void removeBookmark(
            @PathVariable Long id,
            Authentication authentication
    ) {
        postService.removeBookmark(id, authentication);
    }
}
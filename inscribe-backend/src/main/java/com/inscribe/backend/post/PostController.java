package com.inscribe.backend.post;

import com.inscribe.backend.post.dto.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/posts", "/api/posts"})
@RequiredArgsConstructor
@Validated
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
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return postService.getPublishedPosts(page, size);
    }

    @GetMapping("/id/{id}")
    public PostResponse getById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return postService.getPostById(id, authentication);
    }

    @GetMapping("/category/{category}")
    public Page<PostResponse> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return postService.getPostsByCategory(category, page, size);
    }

    @GetMapping("/staff-picks")
    public Page<PostResponse> staffPicks(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return postService.getStaffPicks(page, size);
    }

    @GetMapping("/tag/{tagName}")
    public Page<PostResponse> getByTag(
            @PathVariable String tagName,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return postService.getPostsByTag(tagName, page, size);
    }

    @GetMapping("/bookmarks")
    public Page<PostResponse> getBookmarks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return postService.getBookmarkedPosts(authentication, page, size);
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

}

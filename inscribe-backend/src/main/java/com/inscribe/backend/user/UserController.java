package com.inscribe.backend.user;

import com.inscribe.backend.post.PostService;
import com.inscribe.backend.post.dto.PostResponse;
import com.inscribe.backend.user.dto.ProfileResponse;
import com.inscribe.backend.user.dto.UpdateProfileRequest;
import com.inscribe.backend.user.dto.UserSummaryResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/users", "/api/users"})
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping("/{id}")
    public ProfileResponse getProfile(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return userService.getProfile(id, authentication);
    }

    @GetMapping("/{id}/posts")
    public Page<PostResponse> getUserPosts(
            @PathVariable Long id,
            Authentication authentication,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return postService.getPostsByAuthor(id, authentication, page, size);
    }

    @PutMapping("/me")
    public ProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfile(authentication, request);
    }

    @GetMapping("/search")
    public Page<UserSummaryResponse> searchUsers(
            @RequestParam @Size(min = 1, max = 100) String keyword,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return userService.searchUsers(keyword, page, size);
    }
}

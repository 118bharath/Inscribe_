package com.inscribe.backend.cache;

import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.common.exception.UnauthorizedException;
import com.inscribe.backend.post.Post;
import com.inscribe.backend.post.PostRepository;
import com.inscribe.backend.post.PostStatus;
import com.inscribe.backend.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogCacheService {

    private final PostRepository postRepository;

    @Cacheable(cacheNames = "blogs", key = "#id", unless = "#result == null")
    public PostCachePayload getPublishedPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() != PostStatus.PUBLISHED) {
            throw new UnauthorizedException("Access denied");
        }

        return PostCachePayload.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .status(post.getStatus().name())
                .imageUrl(post.getImageUrl())
                .category(post.getCategory())
                .staffPick(post.isStaffPick())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getName())
                .author(mapToUserResponse(post))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @CacheEvict(cacheNames = "blogs", key = "#postId")
    public void evict(Long postId) {
        // annotation-driven eviction
    }

    private UserResponse mapToUserResponse(Post post) {
        return UserResponse.builder()
                .id(post.getAuthor().getId())
                .username(post.getAuthor().getUsername())
                .name(post.getAuthor().getName())
                .bio(post.getAuthor().getBio())
                .avatar(post.getAuthor().getAvatar())
                .build();
    }
}

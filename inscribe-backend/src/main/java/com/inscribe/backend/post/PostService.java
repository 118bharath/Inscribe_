package com.inscribe.backend.post;

import com.inscribe.backend.bookmark.BookmarkService;
import com.inscribe.backend.bookmark.BookmarkRepository;
import com.inscribe.backend.clap.ClapRepository;
import com.inscribe.backend.common.SlugUtil;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.common.exception.UnauthorizedException;
import com.inscribe.backend.post.dto.*;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import com.inscribe.backend.user.dto.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final BookmarkService bookmarkService;
    private final ClapRepository clapRepository;
    private final BookmarkRepository bookmarkRepository;

    @Transactional
    public PostResponse createPost(PostRequest request, Authentication auth) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String slug = generateUniqueSlug(request.getTitle());

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setSlug(slug);
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setImageUrl(request.getImageUrl());
        post.setCategory(request.getCategory());
        post.setStaffPick(Boolean.TRUE.equals(request.getStaffPick()) && isAdmin(auth));
        post.setStatus(request.getStatus());
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());

        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                if (tagName == null || tagName.isBlank()) {
                    continue;
                }
                String normalizedTag = tagName.trim().toLowerCase(Locale.ROOT);
                Tag tag = tagRepository.findByName(normalizedTag)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(normalizedTag);
                            return tagRepository.save(newTag);
                        });
                post.getTags().add(tag);
            }
        }

        postRepository.save(post);

        return mapToResponse(post, user);
    }

    @Transactional
    public void bookmarkPost(Long postId, Authentication authentication) {
        bookmarkService.bookmarkPost(postId, authentication);
    }

    @Transactional
    public void removeBookmark(Long postId, Authentication authentication) {
        bookmarkService.removeBookmark(postId, authentication);
    }

    public Page<PostResponse> getPublishedPosts(int page, int size) {
        int boundedSize = Math.min(Math.max(size, 1), 50);
        int boundedPage = Math.max(page, 0);

        Page<Post> posts =
                postRepository.findByStatus(
                        PostStatus.PUBLISHED,
                        PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
                );

        return posts.map(post ->
                mapToResponse(post, post.getAuthor()));
    }

    public PostResponse getPostBySlug(String slug, Authentication auth) {

        Post post = postRepository
                .findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        boolean isAuthor = auth != null &&
                auth.getName().equals(post.getAuthor().getEmail());

        if (post.getStatus() == PostStatus.DRAFT && !isAuthor) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToResponse(post, post.getAuthor(), isAuthor);
    }

    public PostResponse getPostById(Long id, Authentication auth) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        boolean isAuthor = auth != null &&
                auth.getName().equals(post.getAuthor().getEmail());

        if (post.getStatus() == PostStatus.DRAFT && !isAuthor) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToResponse(post, post.getAuthor(), isAuthor);
    }

    public Page<PostResponse> getPostsByCategory(String category, int page, int size) {
        int boundedSize = Math.min(Math.max(size, 1), 50);
        int boundedPage = Math.max(page, 0);

        Page<Post> posts = postRepository.findByStatusAndCategoryIgnoreCase(
                PostStatus.PUBLISHED,
                category,
                PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
        );

        return posts.map(post -> mapToResponse(post, post.getAuthor()));
    }

    public Page<PostResponse> getStaffPicks(int page, int size) {
        int boundedSize = Math.min(Math.max(size, 1), 50);
        int boundedPage = Math.max(page, 0);

        Page<Post> posts = postRepository.findByStatusAndStaffPickTrue(
                PostStatus.PUBLISHED,
                PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
        );

        return posts.map(post -> mapToResponse(post, post.getAuthor()));
    }

    public Page<PostResponse> getPostsByTag(String tagName, int page, int size) {
        int boundedSize = Math.min(Math.max(size, 1), 50);
        int boundedPage = Math.max(page, 0);

        Page<Post> posts = postRepository.findByStatusAndTags_NameIgnoreCase(
                PostStatus.PUBLISHED,
                tagName,
                PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
        );

        return posts.map(post -> mapToResponse(post, post.getAuthor()));
    }

    public Page<PostResponse> getPostsByAuthor(Long authorId, Authentication auth, int page, int size) {
        int boundedSize = Math.min(Math.max(size, 1), 50);
        int boundedPage = Math.max(page, 0);

        if (!userRepository.existsById(authorId)) {
            throw new ResourceNotFoundException("User not found");
        }

        boolean ownProfile = isAuthenticatedUser(authorId, auth);
        Page<Post> posts = ownProfile
                ? postRepository.findByAuthorId(
                authorId,
                PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
        )
                : postRepository.findByAuthorIdAndStatus(
                authorId,
                PostStatus.PUBLISHED,
                PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
        );

        return posts.map(post -> mapToResponse(post, post.getAuthor(), ownProfile && post.getAuthor().getId().equals(authorId)));
    }

    public Page<PostResponse> getBookmarkedPosts(Authentication auth, int page, int size) {
        int boundedSize = Math.min(Math.max(size, 1), 50);
        int boundedPage = Math.max(page, 0);

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Post> posts = bookmarkRepository.findVisibleBookmarkedPostsByUserId(
                user.getId(),
                PageRequest.of(boundedPage, boundedSize, Sort.by("createdAt").descending())
        );

        return posts.map(post -> mapToResponse(post, post.getAuthor(), post.getAuthor().getId().equals(user.getId())));
    }

    @Transactional
    public PostResponse updatePost(
            Long id,
            PostRequest request,
            Authentication auth
    ) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getAuthor().getEmail().equals(auth.getName())) {
            throw new UnauthorizedException("Not authorized");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setImageUrl(request.getImageUrl());
        post.setCategory(request.getCategory());
        if (request.getStaffPick() != null && isAdmin(auth)) {
            post.setStaffPick(request.getStaffPick());
        }
        post.setStatus(request.getStatus());
        post.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(post, post.getAuthor());
    }

    @Transactional
    public void deletePost(Long id, Authentication auth) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getAuthor().getEmail().equals(auth.getName())) {
            throw new UnauthorizedException("Not authorized");
        }

        postRepository.delete(post);
    }

    private String generateUniqueSlug(String title) {

        String baseSlug = SlugUtil.toSlug(title);
        String slug = baseSlug;
        int count = 1;

        while (postRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count++;
        }

        return slug;
    }


    private PostResponse mapToResponse(Post post, User author) {
        return mapToResponse(post, author, false);
    }

    private PostResponse mapToResponse(Post post, User author, boolean isAuthor) {

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .imageUrl(post.getImageUrl())
                .status(post.getStatus().name())
                .authorName(author.getName())
                .authorId(author.getId())
                .author(mapToUserResponse(author))
                .category(post.getCategory())
                .staffPick(post.isStaffPick())
                .likeCount(clapRepository.countByPostId(post.getId()))
                .bookmarkCount(bookmarkRepository.countByPostId(post.getId()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .isAuthor(isAuthor)
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .build();
    }

    private boolean isAuthenticatedUser(Long userId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return userRepository.findByEmail(authentication.getName())
                .map(User::getId)
                .filter(userId::equals)
                .isPresent();
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }
}

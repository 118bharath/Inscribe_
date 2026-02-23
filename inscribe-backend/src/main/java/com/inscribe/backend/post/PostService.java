package com.inscribe.backend.post;

import com.inscribe.backend.common.SlugUtil;
import com.inscribe.backend.post.dto.*;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ClapRepository clapRepository;
    private final BookmarkRepository bookmarkRepository;

    @Transactional
    public PostResponse createPost(PostRequest request, Authentication auth) {

        User user = userRepository
                .findByEmail(auth.getName())
                .orElseThrow();

        String slug = generateUniqueSlug(request.getTitle());

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setSlug(slug);
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setStatus(PostStatus.valueOf(request.getStatus()));
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());

        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        });
                post.getTags().add(tag);
            }
        }

        postRepository.save(post);

        return mapToResponse(post, user);
    }

    @Transactional
    public void clapPost(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean alreadyClapped =
                clapRepository.existsByUserIdAndPostId(user.getId(), postId);

        if (alreadyClapped) {
            return; // avoid duplicate
        }

        Clap clap = new Clap();
        clap.setUser(user);
        clap.setPost(post);

        clapRepository.save(clap);
    }

    @Transactional
    public void unclapPost(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean exists =
                clapRepository.existsByUserIdAndPostId(user.getId(), postId);

        if (!exists) {
            return;
        }

        clapRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }

    @Transactional
    public void bookmarkPost(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean exists =
                bookmarkRepository.existsByUserIdAndPostId(user.getId(), postId);

        if (exists) {
            return;
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setPost(post);

        bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        bookmarkRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }

    public Page<PostResponse> getPublishedPosts(int page, int size) {

        Page<Post> posts =
                postRepository.findByStatus(
                        PostStatus.PUBLISHED,
                        PageRequest.of(page, size, Sort.by("createdAt").descending())
                );

        return posts.map(post ->
                mapToResponse(post, post.getAuthor()));
    }

    public PostResponse getPostBySlug(String slug, Authentication auth) {

        Post post = postRepository
                .findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean isAuthor = auth != null &&
                auth.getName().equals(post.getAuthor().getEmail());

        if (post.getStatus() == PostStatus.DRAFT && !isAuthor) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(post, post.getAuthor(), isAuthor);
    }

    @Transactional
    public PostResponse updatePost(
            Long id,
            PostRequest request,
            Authentication auth
    ) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getEmail().equals(auth.getName())) {
            throw new RuntimeException("Not authorized");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setStatus(PostStatus.valueOf(request.getStatus()));
        post.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(post, post.getAuthor());
    }

    @Transactional
    public void deletePost(Long id, Authentication auth) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getEmail().equals(auth.getName())) {
            throw new RuntimeException("Not authorized");
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
                .status(post.getStatus().name())
                .authorName(author.getName())
                .authorId(author.getId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .isAuthor(isAuthor)
                .build();
    }
}

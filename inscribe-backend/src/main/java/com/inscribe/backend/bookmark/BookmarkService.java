package com.inscribe.backend.bookmark;

import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.post.Post;
import com.inscribe.backend.post.PostRepository;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public void bookmarkPost(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        bookmarkRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }
}

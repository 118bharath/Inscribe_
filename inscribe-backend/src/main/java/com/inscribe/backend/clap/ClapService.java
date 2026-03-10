package com.inscribe.backend.clap;

import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.notification.NotificationService;
import com.inscribe.backend.notification.NotificationType;
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
public class ClapService {

    private final ClapRepository clapRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void clapPost(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        boolean alreadyClapped =
                clapRepository.existsByUserIdAndPostId(user.getId(), postId);

        if (alreadyClapped) {
            return;
        }

        Clap clap = new Clap();
        clap.setUser(user);
        clap.setPost(post);

        clapRepository.save(clap);

        notificationService.createNotification(
                post.getAuthor(),
                user,
                NotificationType.CLAP,
                user.getName() + " clapped your post",
                post
        );
    }

    @Transactional
    public void unclapPost(Long postId, Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean exists =
                clapRepository.existsByUserIdAndPostId(user.getId(), postId);

        if (!exists) {
            return;
        }

        clapRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }
}

package com.inscribe.backend.comment;

import com.inscribe.backend.comment.dto.CommentRequest;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.notification.NotificationService;
import com.inscribe.backend.post.Post;
import com.inscribe.backend.post.PostRepository;
import com.inscribe.backend.user.User;
import com.inscribe.backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;
    @Mock
    private PostRepository postRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private CommentService commentService;

    @Test
    void shouldRejectReplyWhenParentCommentBelongsToAnotherPost() {
        CommentRequest request = new CommentRequest();
        request.setContent("Reply");
        request.setParentId(99L);

        User user = new User();
        user.setId(1L);
        user.setEmail("a@b.com");

        Post post = new Post();
        post.setId(10L);
        post.setAuthor(user);

        Post anotherPost = new Post();
        anotherPost.setId(11L);

        Comment parent = new Comment();
        parent.setId(99L);
        parent.setPost(anotherPost);

        when(authentication.getName()).thenReturn("a@b.com");
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(user));
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        when(commentRepository.findById(99L)).thenReturn(Optional.of(parent));

        assertThatThrownBy(() -> commentService.addComment(10L, request, authentication))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Parent comment does not belong");
    }
}


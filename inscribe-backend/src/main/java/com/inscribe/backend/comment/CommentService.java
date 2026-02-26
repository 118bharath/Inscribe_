package com.inscribe.backend.comment;

import com.inscribe.backend.comment.dto.*;
import com.inscribe.backend.common.exception.ResourceNotFoundException;
import com.inscribe.backend.common.exception.UnauthorizedException;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public CommentResponse addComment(
            Long postId,
            CommentRequest request,
            Authentication authentication
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        if (request.getParentId() != null) {
            Comment parent = commentRepository
                    .findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
            comment.setParent(parent);
        }

        commentRepository.save(comment);

        notificationService.createNotification(
                post.getAuthor(),
                user,
                NotificationType.COMMENT,
                user.getName() + " commented on your post",
                post
        );

        return mapToResponse(comment, user);
    }

    public List<CommentResponse> getCommentsByPost(Long postId, Authentication auth) {

        final Long currentUserId = (auth!=null)
                ? userRepository.findByEmail(auth.getName())
                .map(user -> user.getId())
                .orElse(null) : null;

        return commentRepository
                .findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(comment -> mapToResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, Authentication authentication) {

        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getEmail().equals(authentication.getName())) {
            throw new UnauthorizedException("Not authorized");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment, User user) {
        return mapToResponse(comment, user.getId());
    }

    private CommentResponse mapToResponse(Comment comment, Long currentUserId) {

        boolean isAuthor = currentUserId != null &&
                comment.getUser().getId().equals(currentUserId);

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .postId(comment.getPost().getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .createdAt(comment.getCreatedAt())
                .isAuthor(isAuthor)
                .build();
    }
}

package com.inscribe.backend.comment;

import com.inscribe.backend.comment.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public CommentResponse addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        return commentService.addComment(postId, request, authentication);
    }

    @GetMapping
    public List<CommentResponse> getComments(
            @PathVariable Long postId,
            Authentication authentication
    ) {
        return commentService.getCommentsByPost(postId, authentication);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication authentication
    ) {
        commentService.deleteComment(commentId, authentication);
    }
}
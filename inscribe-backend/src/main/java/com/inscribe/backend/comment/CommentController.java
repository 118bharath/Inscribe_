package com.inscribe.backend.comment;

import com.inscribe.backend.comment.dto.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
@RequiredArgsConstructor
@Validated
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
            @RequestParam(defaultValue = "100") @Min(1) @Max(200) int limit,
            Authentication authentication
    ) {
        return commentService.getCommentsByPost(postId, limit, authentication);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication authentication
    ) {
        commentService.deleteComment(postId, commentId, authentication);
    }
}

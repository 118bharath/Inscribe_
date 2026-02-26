package com.inscribe.backend.bookmark;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{id}/bookmark")
    public void bookmark(
            @PathVariable Long id,
            Authentication authentication
    ) {
        bookmarkService.bookmarkPost(id, authentication);
    }

    @DeleteMapping("/{id}/bookmark")
    public void removeBookmark(
            @PathVariable Long id,
            Authentication authentication
    ) {
        bookmarkService.removeBookmark(id, authentication);
    }
}

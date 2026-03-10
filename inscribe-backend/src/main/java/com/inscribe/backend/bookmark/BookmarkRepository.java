package com.inscribe.backend.bookmark;

import com.inscribe.backend.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {

    long countByPostId(Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    void deleteByUserIdAndPostId(Long userId, Long postId);

    @Query("""
            SELECT b.post
            FROM Bookmark b
            WHERE b.user.id = :userId
              AND (b.post.status = 'PUBLISHED' OR b.post.author.id = :userId)
            """)
    Page<Post> findVisibleBookmarkedPostsByUserId(Long userId, Pageable pageable);
}

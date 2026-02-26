package com.inscribe.backend.post;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlugAndStatus(String slug, PostStatus status);

    Optional<Post> findBySlug(String slug);

    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    @Query("""
SELECT DISTINCT p FROM Post p
LEFT JOIN p.tags t
WHERE p.status = 'PUBLISHED'
AND (
    LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
)
""")
    Page<Post> searchPosts(String keyword, Pageable pageable);
}
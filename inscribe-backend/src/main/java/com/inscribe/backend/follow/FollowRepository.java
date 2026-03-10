package com.inscribe.backend.follow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {

    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

    long countByFollowingId(Long followingId);

    long countByFollowerId(Long followerId);

    @Query("""
SELECT f FROM Follow f
JOIN FETCH f.follower
WHERE f.following.id = :userId
""")
    List<Follow> findByFollowingId(Long userId);

    @Query("""
SELECT f FROM Follow f
JOIN FETCH f.following
WHERE f.follower.id = :userId
""")
    List<Follow> findByFollowerId(Long userId);
}

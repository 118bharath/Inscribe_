package com.inscribe.backend.post;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClapRepository extends JpaRepository<Clap, ClapId> {

    long countByPostId(Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    void deleteByUserIdAndPostId(Long userId, Long postId);
}
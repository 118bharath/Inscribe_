package com.inscribe.backend.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
        Optional<User> findByEmail(String email);
        Optional<User> findByEmailIgnoreCase(String email);
        Optional<User> findByUsername(String username);
        boolean existsByEmail(String email);
        boolean existsByEmailIgnoreCase(String email);
        boolean existsByUsername(String username);

        @Query("""
SELECT u FROM User u
WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
        Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

        @Query("""
SELECT u FROM User u
WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
        List<User> searchUsers(@Param("keyword") String keyword);
}

package com.inscribe.backend.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
        Optional<User> findByEmail(String email);
        Optional<User> findByUsername(String username);
        boolean existsByEmail(String email);
        boolean existsByUsername(String username);

        @Query("""
SELECT u FROM User u
WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
        Page<User> searchUsers(String keyword, Pageable pageable);
}

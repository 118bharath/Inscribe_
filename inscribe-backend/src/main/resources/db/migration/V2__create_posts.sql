CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    excerpt LONGTEXT,
    status VARCHAR(20) NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_post_author
            FOREIGN KEY (author_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE INDEX idx_post_slug ON posts(slug);
CREATE INDEX idx_post_status ON posts(status);


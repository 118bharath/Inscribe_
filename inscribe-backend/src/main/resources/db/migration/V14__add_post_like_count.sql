ALTER TABLE posts
    ADD COLUMN like_count BIGINT NOT NULL DEFAULT 0;

UPDATE posts p
SET like_count = (
    SELECT COUNT(*)
    FROM claps c
    WHERE c.post_id = p.id
);

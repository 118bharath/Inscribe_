ALTER TABLE posts
ADD COLUMN category VARCHAR(100) NULL,
ADD COLUMN staff_pick BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_post_category ON posts(category);
CREATE INDEX idx_post_staff_pick ON posts(staff_pick);

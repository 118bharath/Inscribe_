ALTER TABLE refresh_tokens
    ADD COLUMN token_hash VARCHAR(64) NULL,
    ADD COLUMN device_id VARCHAR(100) NOT NULL DEFAULT 'legacy-device',
    ADD COLUMN revoked BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE refresh_tokens
SET token_hash = SHA2(token, 256)
WHERE token_hash IS NULL;

ALTER TABLE refresh_tokens
    MODIFY COLUMN token_hash VARCHAR(64) NOT NULL;

CREATE UNIQUE INDEX uk_refresh_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_user_device_active ON refresh_tokens(user_id, device_id, revoked);

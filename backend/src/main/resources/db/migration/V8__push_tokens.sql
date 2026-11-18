CREATE TABLE push_tokens (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             token TEXT NOT NULL,
                             device_type VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
                             created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                             UNIQUE (user_id, token)
);

CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);
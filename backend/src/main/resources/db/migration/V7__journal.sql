CREATE TABLE journal_entries (
                                 id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                 title_enc   BYTEA NOT NULL,
                                 body_enc    BYTEA NOT NULL,
                                 iv          BYTEA NOT NULL,
                                 created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                                 updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_je_user_id ON journal_entries(user_id);
CREATE TABLE users (
                       id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email         VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role          VARCHAR(20)  NOT NULL,
                       created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE check_ins (
                           id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                           energy              DOUBLE PRECISION NOT NULL CHECK (energy BETWEEN -1 AND 1),
                           pleasantness        DOUBLE PRECISION NOT NULL CHECK (pleasantness BETWEEN -1 AND 1),
                           emotion_label       VARCHAR(50),
                           sleep_hours         DOUBLE PRECISION CHECK (sleep_hours BETWEEN 0 AND 24),
                           movement            BOOLEAN,
                           coffee              BOOLEAN,
                           people              BOOLEAN,
                           work_school         BOOLEAN,
                           screen_time_minutes INTEGER CHECK (screen_time_minutes >= 0),
                           checked_in_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_check_ins_user_time ON check_ins (user_id, checked_in_at DESC);
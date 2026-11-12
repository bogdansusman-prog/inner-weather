-- numele afisat al fiecarui cont
ALTER TABLE users ADD COLUMN display_name VARCHAR(80);
UPDATE users SET display_name = split_part(email, '@', 1);
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;

-- clientul e legat de terapeutul lui (NULL pentru ceilalti)
ALTER TABLE users ADD COLUMN therapist_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX idx_users_therapist ON users (therapist_id);

-- datele in plus ale unui terapeut
CREATE TABLE therapist_profiles (
                                    user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                                    license_number VARCHAR(50) NOT NULL,
                                    status         VARCHAR(20) NOT NULL,
                                    invite_code    VARCHAR(8) UNIQUE,
                                    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
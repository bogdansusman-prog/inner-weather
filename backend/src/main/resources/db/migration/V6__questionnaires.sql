CREATE TABLE questionnaire_responses (
                                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                         user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                         type VARCHAR(10) NOT NULL,
                                         answers JSONB NOT NULL,
                                         score INTEGER NOT NULL,
                                         severity VARCHAR(20) NOT NULL,
                                         taken_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_qr_user_id ON questionnaire_responses(user_id);
CREATE INDEX idx_qr_user_type ON questionnaire_responses(user_id, type);
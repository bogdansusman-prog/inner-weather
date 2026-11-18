CREATE TABLE therapist_client_links (
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                        client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                                        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                        CONSTRAINT uq_therapist_client UNIQUE (therapist_id, client_id)
);

CREATE INDEX idx_tcl_therapist ON therapist_client_links(therapist_id);
CREATE INDEX idx_tcl_client ON therapist_client_links(client_id);
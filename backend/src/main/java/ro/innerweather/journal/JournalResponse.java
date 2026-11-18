package ro.innerweather.journal;

import java.time.Instant;
import java.util.UUID;

public record JournalResponse( //data transfer object pentru raspuns
        UUID id,
        String title,
        String body,
        Instant createdAt,
        Instant updatedAt
) {
    static JournalResponse from(JournalEntry e, String title, String body) {
        return new JournalResponse(e.getId(), title, body, e.getCreatedAt(), e.getUpdatedAt());
    }
}
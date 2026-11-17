package ro.innerweather.therapist;

import java.time.Instant;
import java.util.UUID;

public record TherapistClientLinkResponse(
        UUID id,
        UUID therapistId,
        UUID clientId,
        LinkStatus status,
        Instant createdAt,
        Instant updatedAt) {

    public static TherapistClientLinkResponse from(TherapistClientLink link) {
        return new TherapistClientLinkResponse(
                link.getId(),
                link.getTherapistId(),
                link.getClientId(),
                link.getStatus(),
                link.getCreatedAt(),
                link.getUpdatedAt());
    }
}
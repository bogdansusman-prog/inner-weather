package ro.innerweather.therapist;

import java.time.Instant;
import java.util.UUID;

// ce vede adminul despre un terapeut
public record TherapistReview(
        UUID userId,
        String name,
        String email,
        String licenseNumber,
        TherapistStatus status,
        String inviteCode,
        Instant createdAt) {
}
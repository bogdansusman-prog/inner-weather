package ro.innerweather.therapist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "therapist_profiles")
@Getter
@Setter
@NoArgsConstructor
public class TherapistProfile {

    // acelasi id ca utilizatorul (un profil per terapeut)
    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "license_number", nullable = false, length = 50)
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TherapistStatus status = TherapistStatus.PENDING;

    // codul dat clientilor; apare abia dupa aprobare
    @Column(name = "invite_code", unique = true, length = 8)
    private String inviteCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
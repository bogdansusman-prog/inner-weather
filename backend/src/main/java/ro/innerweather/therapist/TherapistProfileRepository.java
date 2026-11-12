package ro.innerweather.therapist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TherapistProfileRepository extends JpaRepository<TherapistProfile, UUID> {

    Optional<TherapistProfile> findByInviteCodeAndStatus(String inviteCode, TherapistStatus status);

    boolean existsByInviteCode(String inviteCode);

    List<TherapistProfile> findByStatusOrderByCreatedAtAsc(TherapistStatus status);
}
package ro.innerweather.therapist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TherapistClientLinkRepository extends JpaRepository<TherapistClientLink, UUID> {

    List<TherapistClientLink> findByTherapistId(UUID therapistId);

    List<TherapistClientLink> findByClientId(UUID clientId);

    Optional<TherapistClientLink> findByTherapistIdAndClientId(UUID therapistId, UUID clientId);

    boolean existsByTherapistIdAndClientId(UUID therapistId, UUID clientId);

    Optional<TherapistClientLink> findByClientIdAndStatus(UUID clientId, LinkStatus status);
}
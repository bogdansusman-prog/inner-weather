package ro.innerweather.checkin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {

    List<CheckIn> findByUserIdAndCheckedInAtBetweenOrderByCheckedInAtAsc(
            UUID userId, Instant from, Instant to);
}
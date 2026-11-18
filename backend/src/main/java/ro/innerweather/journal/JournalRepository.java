package ro.innerweather.journal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JournalRepository extends JpaRepository<JournalEntry, UUID> {

    List<JournalEntry> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<JournalEntry> findByIdAndUserId(UUID id, UUID userId);
}
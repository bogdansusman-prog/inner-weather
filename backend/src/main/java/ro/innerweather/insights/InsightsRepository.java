package ro.innerweather.insights;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.innerweather.checkin.CheckIn;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface InsightsRepository extends JpaRepository<CheckIn, UUID> {

    @Query("SELECT AVG(c.energy), AVG(c.pleasantness), COUNT(c) " +
            "FROM CheckIn c WHERE c.user.id = :userId AND c.checkedInAt >= :since")
    Object[] avgStatsAndCount(@Param("userId") UUID userId, @Param("since") Instant since);

    @Query("SELECT c.emotionLabel, COUNT(c) FROM CheckIn c " +
            "WHERE c.user.id = :userId AND c.checkedInAt >= :since AND c.emotionLabel IS NOT NULL " +
            "GROUP BY c.emotionLabel ORDER BY COUNT(c) DESC")
    List<Object[]> topEmotions(@Param("userId") UUID userId, @Param("since") Instant since);
}
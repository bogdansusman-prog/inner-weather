package ro.innerweather.insights;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.innerweather.questionnaire.QuestionnaireRepository;
import ro.innerweather.questionnaire.QuestionnaireType;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private final InsightsRepository insightsRepository;
    private final QuestionnaireRepository questionnaireRepository;

    @Transactional(readOnly = true)
    public InsightsSummary getSummary(UUID userId) {
        Instant now = Instant.now();
        Instant since7d = now.minus(7, ChronoUnit.DAYS);
        Instant since30d = now.minus(30, ChronoUnit.DAYS);

        Object[] stats7d = insightsRepository.avgStatsAndCount(userId, since7d);
        Object[] stats30d = insightsRepository.avgStatsAndCount(userId, since30d);

        InsightsSummary.CheckInStats checkInStats = new InsightsSummary.CheckInStats(
                toDouble(stats7d[0]),
                toDouble(stats7d[1]),
                toDouble(stats30d[0]),
                toDouble(stats30d[1]),
                toLong(stats7d[2]),
                toLong(stats30d[2])
        );

        List<InsightsSummary.EmotionCount> topEmotions = insightsRepository
                .topEmotions(userId, since30d)
                .stream()
                .limit(5)
                .map(row -> new InsightsSummary.EmotionCount((String) row[0], (Long) row[1]))
                .toList();

        InsightsSummary.LatestQuestionnaire latestPhq9 = questionnaireRepository
                .findByUserIdAndTypeOrderByTakenAtDesc(userId, QuestionnaireType.PHQ9)
                .stream().findFirst()
                .map(q -> new InsightsSummary.LatestQuestionnaire(q.getScore(), q.getSeverity().name(), q.getTakenAt()))
                .orElse(null);

        InsightsSummary.LatestQuestionnaire latestGad7 = questionnaireRepository
                .findByUserIdAndTypeOrderByTakenAtDesc(userId, QuestionnaireType.GAD7)
                .stream().findFirst()
                .map(q -> new InsightsSummary.LatestQuestionnaire(q.getScore(), q.getSeverity().name(), q.getTakenAt()))
                .orElse(null);

        return new InsightsSummary(checkInStats, topEmotions, latestPhq9, latestGad7);
    }

    private Double toDouble(Object o) {
        return o == null ? null : ((Number) o).doubleValue();
    }

    private Long toLong(Object o) {
        return o == null ? 0L : ((Number) o).longValue();
    }
}
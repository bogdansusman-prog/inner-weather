package ro.innerweather.insights;

import java.util.List;

public record InsightsSummary(
        CheckInStats checkIn,
        List<EmotionCount> topEmotions,
        LatestQuestionnaire latestPhq9,
        LatestQuestionnaire latestGad7) {

    public record CheckInStats(
            Double avgEnergy7d,
            Double avgPleasantness7d,
            Double avgEnergy30d,
            Double avgPleasantness30d,
            Long totalCheckIns7d,
            Long totalCheckIns30d) {}

    public record EmotionCount(String emotionLabel, Long count) {}

    public record LatestQuestionnaire(Integer score, String severity, java.time.Instant takenAt) {}
}
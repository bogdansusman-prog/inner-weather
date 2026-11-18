package ro.innerweather.questionnaire;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record QuestionnaireResponseDto(
        UUID id,
        QuestionnaireType type,
        List<Integer> answers,
        Integer score,
        Severity severity,
        Instant takenAt,
        boolean needsSupport) {

    public static QuestionnaireResponseDto from(QuestionnaireResponse r) {
        boolean needsSupport = r.getType() == QuestionnaireType.PHQ9
                && r.getAnswers() != null
                && r.getAnswers().size() >= 9
                && r.getAnswers().get(8) > 0;
        return new QuestionnaireResponseDto(
                r.getId(),
                r.getType(),
                r.getAnswers(),
                r.getScore(),
                r.getSeverity(),
                r.getTakenAt(),
                needsSupport);
    }
}
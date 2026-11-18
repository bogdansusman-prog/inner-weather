package ro.innerweather.questionnaire;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record QuestionnaireResponseDto( //data transfer object
        UUID id,
        QuestionnaireType type,
        List<Integer> answers,
        Integer score,
        Severity severity,
        Instant takenAt) {

    public static QuestionnaireResponseDto from(QuestionnaireResponse r) {
        return new QuestionnaireResponseDto(
                r.getId(),
                r.getType(),
                r.getAnswers(),
                r.getScore(),
                r.getSeverity(),
                r.getTakenAt());
    }
}
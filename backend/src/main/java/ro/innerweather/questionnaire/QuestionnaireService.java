package ro.innerweather.questionnaire;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.innerweather.common.ApiException;
import ro.innerweather.therapist.TherapistClientLinkRepository;
import ro.innerweather.therapist.LinkStatus;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionnaireService {

    private final QuestionnaireRepository repository;
    private final TherapistClientLinkRepository linkRepository;

    @Transactional
    public QuestionnaireResponseDto submit(UUID userId, QuestionnaireRequest request) {
        List<Integer> answers = request.answers();
        int expected = request.type() == QuestionnaireType.PHQ9 ? 9 : 7;

        if (answers.size() != expected) {
            throw ApiException.invalidField("answers",
                    "Expected " + expected + " answers for " + request.type());
        }

        for (int i = 0; i < answers.size(); i++) {
            if (answers.get(i) < 0 || answers.get(i) > 3) {
                throw ApiException.invalidField("answers",
                        "Each answer must be between 0 and 3");
            }
        }

        int score = answers.stream().mapToInt(Integer::intValue).sum();
        Severity severity = calculateSeverity(request.type(), score);

        QuestionnaireResponse response = new QuestionnaireResponse();
        response.setUserId(userId);
        response.setType(request.type());
        response.setAnswers(answers);
        response.setScore(score);
        response.setSeverity(severity);

        QuestionnaireResponse saved = repository.save(response);

        // PHQ-9 intrebarea 9 (autovatamare)
        if (request.type() == QuestionnaireType.PHQ9 && answers.get(8) > 0) {
            linkRepository.findByClientIdAndStatus(userId, LinkStatus.ACCEPTED)
                    .ifPresent(link -> log.warn(
                            "SUPPORT_NEEDED: user={} therapist={} phq9_q9={}",
                            userId, link.getTherapistId(), answers.get(8)));
        }

        return QuestionnaireResponseDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<QuestionnaireResponseDto> getHistory(UUID userId, QuestionnaireType type) {
        if (type != null) {
            return repository.findByUserIdAndTypeOrderByTakenAtDesc(userId, type)
                    .stream().map(QuestionnaireResponseDto::from).toList();
        }
        return repository.findByUserIdOrderByTakenAtDesc(userId)
                .stream().map(QuestionnaireResponseDto::from).toList();
    }

    private Severity calculateSeverity(QuestionnaireType type, int score) {
        if (type == QuestionnaireType.PHQ9) {
            if (score <= 4)  return Severity.MINIMAL;
            if (score <= 9)  return Severity.MILD;
            if (score <= 14) return Severity.MODERATE;
            if (score <= 19) return Severity.MODERATELY_SEVERE;
            return Severity.SEVERE;
        } else {
            if (score <= 4)  return Severity.MINIMAL;
            if (score <= 9)  return Severity.MILD;
            if (score <= 14) return Severity.MODERATE;
            return Severity.SEVERE;
        }
    }
}
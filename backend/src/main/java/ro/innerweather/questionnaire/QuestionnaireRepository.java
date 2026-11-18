package ro.innerweather.questionnaire;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionnaireRepository extends JpaRepository<QuestionnaireResponse, UUID> {

    List<QuestionnaireResponse> findByUserIdOrderByTakenAtDesc(UUID userId);

    List<QuestionnaireResponse> findByUserIdAndTypeOrderByTakenAtDesc(UUID userId, QuestionnaireType type);
}
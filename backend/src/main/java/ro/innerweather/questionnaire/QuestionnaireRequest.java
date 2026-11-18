package ro.innerweather.questionnaire;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record QuestionnaireRequest(
        @NotNull QuestionnaireType type,
        @NotNull @Size(min = 7, max = 9) List<Integer> answers) {
}
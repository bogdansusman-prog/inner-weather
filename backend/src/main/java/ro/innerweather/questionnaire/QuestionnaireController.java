package ro.innerweather.questionnaire;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {

    private final QuestionnaireService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionnaireResponseDto submit(@AuthenticationPrincipal Jwt jwt,
                                           @Valid @RequestBody QuestionnaireRequest request) {
        return service.submit(UUID.fromString(jwt.getSubject()), request);
    }

    @GetMapping
    public List<QuestionnaireResponseDto> history(@AuthenticationPrincipal Jwt jwt,
                                                  @RequestParam(required = false) QuestionnaireType type) {
        return service.getHistory(UUID.fromString(jwt.getSubject()), type);
    }
}
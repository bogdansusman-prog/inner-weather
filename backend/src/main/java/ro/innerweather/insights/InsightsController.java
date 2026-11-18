package ro.innerweather.insights;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final InsightsService service;

    @GetMapping
    public InsightsSummary getSummary(@AuthenticationPrincipal Jwt jwt) {
        return service.getSummary(UUID.fromString(jwt.getSubject()));
    }
}
package ro.innerweather.therapist;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class TherapistClientLinkController {

    private final TherapistClientLinkService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CLIENT')")
    public TherapistClientLinkResponse requestLink(@AuthenticationPrincipal Jwt jwt,
                                                   @RequestParam String inviteCode) {
        return service.requestLink(UUID.fromString(jwt.getSubject()), inviteCode);
    }

    @GetMapping("/my")
    public List<TherapistClientLinkResponse> myLinks(@AuthenticationPrincipal Jwt jwt) {
        return service.getLinksForClient(UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/requests")
    public List<TherapistClientLinkResponse> requests(@AuthenticationPrincipal Jwt jwt) {
        return service.getLinksForTherapist(UUID.fromString(jwt.getSubject()));
    }

    @PatchMapping("/{id}/status")
    public TherapistClientLinkResponse updateStatus(@AuthenticationPrincipal Jwt jwt,
                                                    @PathVariable UUID id,
                                                    @RequestParam LinkStatus status) {
        return service.updateStatus(UUID.fromString(jwt.getSubject()), id, status);
    }
}
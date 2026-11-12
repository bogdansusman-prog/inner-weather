package ro.innerweather.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import ro.innerweather.therapist.TherapistProfile;
import ro.innerweather.therapist.TherapistProfileRepository;

import java.util.UUID;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final UserRepository users;
    private final TherapistProfileRepository therapists;

    @GetMapping
    public MeResponse me(@AuthenticationPrincipal Jwt jwt) {
        UUID id = UUID.fromString(jwt.getSubject());
        User user = users.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        TherapistProfile profile = user.getRole() == Role.THERAPIST
                ? therapists.findById(id).orElse(null)
                : null;

        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                profile == null ? null : profile.getStatus(),
                profile == null ? null : profile.getInviteCode());
    }
}
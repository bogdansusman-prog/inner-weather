package ro.innerweather.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ro.innerweather.therapist.TherapistProfile;
import ro.innerweather.therapist.TherapistProfileRepository;
import ro.innerweather.therapist.TherapistStatus;
import ro.innerweather.user.Role;
import ro.innerweather.user.User;
import ro.innerweather.user.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository users;
    private final TherapistProfileRepository therapists;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // totul intr-o tranzactie: daca ceva crapa, nu ramane un cont pe jumatate
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.email());
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setDisplayName(request.name().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        switch (request.accountType()) {
            case USER -> user.setRole(Role.USER);
            case CLIENT -> {
                user.setRole(Role.CLIENT);
                user.setTherapistId(findApprovedTherapist(request.therapistCode()));
            }
            case THERAPIST -> {
                user.setRole(Role.THERAPIST);
                requireText(request.licenseNumber(), "License number is required");
            }
        }

        User saved = users.save(user);

        if (saved.getRole() == Role.THERAPIST) {
            TherapistProfile profile = new TherapistProfile();
            profile.setUserId(saved.getId());
            profile.setLicenseNumber(request.licenseNumber().trim());
            therapists.save(profile); // porneste PENDING
        }

        return new AuthResponse(jwtService.generate(saved));
    }

    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(normalize(request.email()))
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        return new AuthResponse(jwtService.generate(user));
    }

    // clientul se poate lega doar de un terapeut aprobat
    private UUID findApprovedTherapist(String code) {
        requireText(code, "Therapist code is required");
        return therapists.findByInviteCodeAndStatus(code.trim().toUpperCase(), TherapistStatus.APPROVED)
                .map(TherapistProfile::getUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Unknown therapist code"));
    }

    private void requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }
}
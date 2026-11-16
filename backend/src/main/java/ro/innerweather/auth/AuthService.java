package ro.innerweather.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.innerweather.common.ApiException;
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
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LoginRateLimiter rateLimiter;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.email());
        if (users.existsByEmail(email)) {
            throw ApiException.conflict("EMAIL_TAKEN", "Email already in use");
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
                requireText("licenseNumber", request.licenseNumber(), "License number is required");
            }
        }

        User saved = users.save(user);

        if (saved.getRole() == Role.THERAPIST) {
            TherapistProfile profile = new TherapistProfile();
            profile.setUserId(saved.getId());
            profile.setLicenseNumber(request.licenseNumber().trim());
            therapists.save(profile);
        }

        return buildAuthResponse(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = normalize(request.email());

        if (!rateLimiter.tryConsume(email)) {
            throw ApiException.unauthorized("TOO_MANY_ATTEMPTS",
                    "Too many login attempts. Try again in 15 minutes.");
        }

        User user = users.findByEmail(email)
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> ApiException.unauthorized("INVALID_CREDENTIALS", "Invalid credentials"));

        return buildAuthResponse(user);
    }

    @Transactional
    public void logout(String refreshToken) {
        String hash = jwtService.hashToken(refreshToken);
        refreshTokens.findByTokenHash(hash)
                .ifPresent(refreshTokens::delete);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        String hash = jwtService.hashToken(refreshToken);
        RefreshToken stored = refreshTokens.findByTokenHash(hash)
                .orElseThrow(() -> ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Invalid or expired refresh token"));

        if (stored.getExpiresAt().isBefore(java.time.Instant.now())) {
            refreshTokens.delete(stored);
            throw ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
        }

        User user = users.findById(stored.getUserId())
                .orElseThrow(() -> ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Invalid or expired refresh token"));

        refreshTokens.delete(stored);
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String rawRefresh = jwtService.generateRefreshToken();
        RefreshToken token = new RefreshToken();
        token.setUserId(user.getId());
        token.setTokenHash(jwtService.hashToken(rawRefresh));
        token.setExpiresAt(jwtService.refreshTokenExpiry());
        refreshTokens.save(token);
        return new AuthResponse(jwtService.generateAccessToken(user), rawRefresh);
    }

    private UUID findApprovedTherapist(String code) {
        requireText("therapistCode", code, "Therapist code is required");
        return therapists.findByInviteCodeAndStatus(code.trim().toUpperCase(), TherapistStatus.APPROVED)
                .map(TherapistProfile::getUserId)
                .orElseThrow(() -> ApiException.invalidField("therapistCode", "Unknown therapist code"));
    }

    private void requireText(String field, String value, String message) {
        if (value == null || value.isBlank()) {
            throw ApiException.invalidField(field, message);
        }
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }
}
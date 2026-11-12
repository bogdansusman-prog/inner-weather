package ro.innerweather.therapist;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ro.innerweather.user.User;
import ro.innerweather.user.UserRepository;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TherapistReviewService {

    // fara 0/O si 1/I/L, ca sa nu se confunde cand e dictat
    private static final String CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    private final SecureRandom random = new SecureRandom();
    private final TherapistProfileRepository therapists;
    private final UserRepository users;

    @Transactional(readOnly = true)
    public List<TherapistReview> pending() {
        return therapists.findByStatusOrderByCreatedAtAsc(TherapistStatus.PENDING).stream()
                .map(this::toReview)
                .toList();
    }

    @Transactional
    public TherapistReview approve(UUID userId) {
        TherapistProfile profile = find(userId);
        profile.setStatus(TherapistStatus.APPROVED);
        if (profile.getInviteCode() == null) {
            profile.setInviteCode(newInviteCode());
        }
        return toReview(profile);
    }

    @Transactional
    public TherapistReview reject(UUID userId) {
        TherapistProfile profile = find(userId);
        profile.setStatus(TherapistStatus.REJECTED);
        return toReview(profile);
    }

    private TherapistProfile find(UUID userId) {
        return therapists.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Therapist not found"));
    }

    private String newInviteCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CODE_ALPHABET.charAt(random.nextInt(CODE_ALPHABET.length())));
            }
            code = sb.toString();
        } while (therapists.existsByInviteCode(code)); // foarte rar, dar codul trebuie sa fie unic
        return code;
    }

    private TherapistReview toReview(TherapistProfile profile) {
        User user = users.findById(profile.getUserId()).orElseThrow();
        return new TherapistReview(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                profile.getLicenseNumber(),
                profile.getStatus(),
                profile.getInviteCode(),
                profile.getCreatedAt());
    }
}
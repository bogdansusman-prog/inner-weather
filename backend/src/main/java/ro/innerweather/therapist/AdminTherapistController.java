package ro.innerweather.therapist;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

// doar pentru ADMIN (regula e in SecurityConfig)
@RestController
@RequestMapping("/api/admin/therapists")
@RequiredArgsConstructor
public class AdminTherapistController {

    private final TherapistReviewService reviews;

    @GetMapping("/pending")
    public List<TherapistReview> pending() {
        return reviews.pending();
    }

    @PostMapping("/{userId}/approve")
    public TherapistReview approve(@PathVariable UUID userId) {
        return reviews.approve(userId);
    }

    @PostMapping("/{userId}/reject")
    public TherapistReview reject(@PathVariable UUID userId) {
        return reviews.reject(userId);
    }
}
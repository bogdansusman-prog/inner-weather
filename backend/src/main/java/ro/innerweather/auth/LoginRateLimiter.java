package ro.innerweather.auth;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public void recordFailure(String email) {
        buckets.computeIfAbsent(email.toLowerCase(), k -> newBucket())
                .tryConsume(1);
    }

    public boolean isAllowed(String email) {
        return buckets.computeIfAbsent(email.toLowerCase(), k -> newBucket())
                .getAvailableTokens() > 0;
    }

    public void reset(String email) {
        buckets.remove(email.toLowerCase());
    }

    private Bucket newBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(5)
                        .refillIntervally(5, Duration.ofMinutes(15))
                        .build())
                .build();
    }
}
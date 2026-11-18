package ro.innerweather.push;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PushTokenRepository extends JpaRepository<PushToken, UUID> {
    List<PushToken> findByUserId(UUID userId);
    void deleteByUserIdAndToken(UUID userId, String token);
}
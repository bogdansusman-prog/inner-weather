package ro.innerweather.journal;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.innerweather.common.ApiException;
import ro.innerweather.user.User;
import ro.innerweather.user.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    @Transactional(readOnly = true)
    public List<JournalResponse> getAll(UUID userId) {
        return journalRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(e -> JournalResponse.from(e,
                        encryptionService.decrypt(e.getTitleEnc()),
                        encryptionService.decrypt(e.getBodyEnc())))
                .toList();
    }

    @Transactional(readOnly = true)
    public JournalResponse getOne(UUID userId, UUID entryId) {
        JournalEntry e = journalRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> ApiException.notFound("Journal entry not found"));
        return JournalResponse.from(e,
                encryptionService.decrypt(e.getTitleEnc()),
                encryptionService.decrypt(e.getBodyEnc()));
    }

    @Transactional
    public JournalResponse create(UUID userId, JournalRequest req) {
        User user = userRepository.getReferenceById(userId);
        JournalEntry e = new JournalEntry();
        e.setUser(user);
        e.setTitleEnc(encryptionService.encrypt(req.title()));
        e.setBodyEnc(encryptionService.encrypt(req.body()));
        e.setIv(new byte[0]); // iv e inclus în câmpurile enc
        return JournalResponse.from(journalRepository.save(e),
                req.title(), req.body());
    }

    @Transactional
    public JournalResponse update(UUID userId, UUID entryId, JournalRequest req) {
        JournalEntry e = journalRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> ApiException.notFound("Journal entry not found"));
        e.setTitleEnc(encryptionService.encrypt(req.title()));
        e.setBodyEnc(encryptionService.encrypt(req.body()));
        e.setUpdatedAt(Instant.now());
        return JournalResponse.from(journalRepository.save(e),
                req.title(), req.body());
    }

    @Transactional
    public void delete(UUID userId, UUID entryId) {
        JournalEntry e = journalRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> ApiException.notFound("Journal entry not found"));
        journalRepository.delete(e);
    }
}
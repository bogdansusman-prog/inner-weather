package ro.innerweather.journal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.innerweather.user.User;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "journal_entries")
@Getter @Setter @NoArgsConstructor
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title_enc", nullable = false)
    private byte[] titleEnc;

    @Column(name = "body_enc", nullable = false)
    private byte[] bodyEnc;

    @Column(name = "iv", nullable = false)
    private byte[] iv;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}
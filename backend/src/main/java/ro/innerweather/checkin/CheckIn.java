package ro.innerweather.checkin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.innerweather.user.User;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "check_ins")
@Getter
@Setter
@NoArgsConstructor
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private double energy;

    @Column(nullable = false)
    private double pleasantness;

    @Column(name = "emotion_label")
    private String emotionLabel;

    @Column(name = "sleep_hours")
    private Double sleepHours;

    private Boolean movement;

    private Boolean coffee;

    private Boolean people;

    @Column(name = "work_school")
    private Boolean workSchool;

    @Column(name = "screen_time_minutes")
    private Integer screenTimeMinutes;

    @Column(name = "checked_in_at", nullable = false)
    private Instant checkedInAt = Instant.now();
}
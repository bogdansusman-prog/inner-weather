package ro.innerweather.checkin;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.innerweather.user.UserRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkIns;
    private final UserRepository users;

    @Transactional
    public CheckInResponse create(UUID userId, CheckInRequest request) {
        CheckIn checkIn = new CheckIn();
        checkIn.setUser(users.getReferenceById(userId));
        checkIn.setEnergy(request.energy());
        checkIn.setPleasantness(request.pleasantness());
        checkIn.setEmotionLabel(request.emotionLabel());
        checkIn.setSleepHours(request.sleepHours());
        checkIn.setMovement(request.movement());
        checkIn.setCoffee(request.coffee());
        checkIn.setPeople(request.people());
        checkIn.setWorkSchool(request.workSchool());
        checkIn.setScreenTimeMinutes(request.screenTimeMinutes());
        return CheckInResponse.from(checkIns.save(checkIn));
    }

    @Transactional(readOnly = true)
    public List<CheckInResponse> list(UUID userId, Instant from, Instant to) {
        return checkIns
                .findByUserIdAndCheckedInAtBetweenOrderByCheckedInAtAsc(userId, from, to)
                .stream()
                .map(CheckInResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DaySummary> calendar(UUID userId, YearMonth month, ZoneId zone) {
        Instant from = month.atDay(1).atStartOfDay(zone).toInstant();
        Instant to = month.plusMonths(1).atDay(1).atStartOfDay(zone).toInstant();

        Map<LocalDate, List<CheckIn>> byDay = checkIns
                .findByUserIdAndCheckedInAtBetweenOrderByCheckedInAtAsc(userId, from, to)
                .stream()
                .filter(c -> c.getCheckedInAt().isBefore(to))
                .collect(Collectors.groupingBy(
                        c -> c.getCheckedInAt().atZone(zone).toLocalDate(),
                        TreeMap::new,
                        Collectors.toList()));

        return byDay.entrySet().stream()
                .map(entry -> summarize(entry.getKey(), entry.getValue()))
                .toList();
    }

    private DaySummary summarize(LocalDate date, List<CheckIn> dayCheckIns) {
        double energy = dayCheckIns.stream().mapToDouble(CheckIn::getEnergy).average().orElse(0);
        double pleasantness = dayCheckIns.stream().mapToDouble(CheckIn::getPleasantness).average().orElse(0);
        return new DaySummary(
                date,
                dayCheckIns.size(),
                round2(energy),
                round2(pleasantness),
                Weather.of(energy, pleasantness));
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
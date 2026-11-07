package ro.innerweather.checkin;

import java.time.LocalDate;

public record DaySummary(
        LocalDate date,
        int count,
        double avgEnergy,
        double avgPleasantness,
        Weather weather) {
}
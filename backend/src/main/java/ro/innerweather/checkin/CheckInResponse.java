package ro.innerweather.checkin;

import java.time.Instant;
import java.util.UUID;

public record CheckInResponse(
        UUID id,
        double energy,
        double pleasantness,
        Weather weather,
        String emotionLabel,
        String note,
        Double sleepHours,
        Boolean movement,
        Boolean coffee,
        Boolean people,
        Boolean workSchool,
        Integer screenTimeMinutes,
        Instant checkedInAt) {

    public static CheckInResponse from(CheckIn c) {
        return new CheckInResponse(
                c.getId(),
                c.getEnergy(),
                c.getPleasantness(),
                Weather.of(c.getEnergy(), c.getPleasantness()),
                c.getEmotionLabel(),
                c.getNote(),
                c.getSleepHours(),
                c.getMovement(),
                c.getCoffee(),
                c.getPeople(),
                c.getWorkSchool(),
                c.getScreenTimeMinutes(),
                c.getCheckedInAt());
    }
}
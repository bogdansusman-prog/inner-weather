package ro.innerweather.checkin;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CheckInRequest(
        @NotNull @DecimalMin("-1.0") @DecimalMax("1.0") Double energy,
        @NotNull @DecimalMin("-1.0") @DecimalMax("1.0") Double pleasantness,
        @Size(max = 50) String emotionLabel,
        @DecimalMin("0.0") @DecimalMax("24.0") Double sleepHours,
        Boolean movement,
        Boolean coffee,
        Boolean people,
        Boolean workSchool,
        @Min(0) Integer screenTimeMinutes) {
}
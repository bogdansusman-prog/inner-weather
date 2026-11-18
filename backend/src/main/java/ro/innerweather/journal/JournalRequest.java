package ro.innerweather.journal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JournalRequest(
        @NotBlank @Size(max = 255) String title,
        @NotBlank String body
) {}
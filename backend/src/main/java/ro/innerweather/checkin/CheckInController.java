package ro.innerweather.checkin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/check-ins")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckInResponse create(@AuthenticationPrincipal Jwt jwt,
                                  @Valid @RequestBody CheckInRequest request) {
        return service.create(UUID.fromString(jwt.getSubject()), request);
    }

    @GetMapping
    public List<CheckInResponse> list(@AuthenticationPrincipal Jwt jwt,
                                      @RequestParam(required = false) Instant from,
                                      @RequestParam(required = false) Instant to) {
        Instant end = to != null ? to : Instant.now();
        Instant start = from != null ? from : end.minus(30, ChronoUnit.DAYS);
        return service.list(UUID.fromString(jwt.getSubject()), start, end);
    }

    @GetMapping("/calendar")
    public List<DaySummary> calendar(@AuthenticationPrincipal Jwt jwt,
                                     @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
                                     @RequestParam(defaultValue = "UTC") ZoneId zone) {
        return service.calendar(UUID.fromString(jwt.getSubject()), month, zone);
    }

    @GetMapping("/{id}")
    public CheckInResponse getById(@AuthenticationPrincipal Jwt jwt,
                                   @PathVariable UUID id) {
        return service.getById(UUID.fromString(jwt.getSubject()), id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt,
                       @PathVariable UUID id) {
        service.delete(UUID.fromString(jwt.getSubject()), id);
    }
}
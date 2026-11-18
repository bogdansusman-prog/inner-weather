package ro.innerweather.journal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService service;

    @GetMapping
    public List<JournalResponse> getAll(@AuthenticationPrincipal Jwt jwt) {
        return service.getAll(UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/{id}")
    public JournalResponse getOne(@AuthenticationPrincipal Jwt jwt,
                                  @PathVariable UUID id) {
        return service.getOne(UUID.fromString(jwt.getSubject()), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JournalResponse create(@AuthenticationPrincipal Jwt jwt,
                                  @Valid @RequestBody JournalRequest req) {
        return service.create(UUID.fromString(jwt.getSubject()), req);
    }

    @PutMapping("/{id}")
    public JournalResponse update(@AuthenticationPrincipal Jwt jwt,
                                  @PathVariable UUID id,
                                  @Valid @RequestBody JournalRequest req) {
        return service.update(UUID.fromString(jwt.getSubject()), id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt,
                       @PathVariable UUID id) {
        service.delete(UUID.fromString(jwt.getSubject()), id);
    }
}
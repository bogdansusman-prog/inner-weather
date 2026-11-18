package ro.innerweather.export;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class PdfExportController {

    private final PdfExportService service;

    @GetMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> exportPdf(@AuthenticationPrincipal Jwt jwt) {
        byte[] pdf = service.generateReport(UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"inner-weather-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
package ro.innerweather.export;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.innerweather.checkin.CheckIn;
import ro.innerweather.checkin.CheckInRepository;
import ro.innerweather.insights.InsightsService;
import ro.innerweather.insights.InsightsSummary;

import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PdfExportService {

    private final CheckInRepository checkInRepository;
    private final InsightsService insightsService;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.of("UTC"));

    public byte[] generateReport(UUID userId) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf)) {

            doc.add(new Paragraph("Inner Weather — Raport personal")
                    .setBold().setFontSize(18));
            doc.add(new Paragraph("Generat la: " + FMT.format(java.time.Instant.now())));
            doc.add(new Paragraph(" "));

            // Sumar insights
            InsightsSummary summary = insightsService.getSummary(userId);
            doc.add(new Paragraph("Statistici (ultimele 7 zile)").setBold().setFontSize(14));
            doc.add(new Paragraph("Check-in-uri: " + summary.checkIn().totalCheckIns7d()));
            if (summary.checkIn().avgEnergy7d() != null) {
                doc.add(new Paragraph(String.format("Energie medie: %.1f", summary.checkIn().avgEnergy7d())));
                doc.add(new Paragraph(String.format("Plăcere medie: %.1f", summary.checkIn().avgPleasantness7d())));
            }

            if (summary.latestPhq9() != null) {
                doc.add(new Paragraph(" "));
                doc.add(new Paragraph("Ultimul PHQ-9").setBold().setFontSize(14));
                doc.add(new Paragraph("Scor: " + summary.latestPhq9().score() + " — " + summary.latestPhq9().severity()));
            }

            if (summary.latestGad7() != null) {
                doc.add(new Paragraph(" "));
                doc.add(new Paragraph("Ultimul GAD-7").setBold().setFontSize(14));
                doc.add(new Paragraph("Scor: " + summary.latestGad7().score() + " — " + summary.latestGad7().severity()));
            }

            // Tabel check-in-uri
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Istoric check-in-uri (ultimele 30)").setBold().setFontSize(14));

            List<CheckIn> checkIns = checkInRepository
                    .findByUserIdAndCheckedInAtBetweenOrderByCheckedInAtAsc(
                            userId,
                            java.time.Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS),
                            java.time.Instant.now())
                    .stream().limit(30).toList();

            if (!checkIns.isEmpty()) {
                Table table = new Table(4);
                table.addCell(new Cell().add(new Paragraph("Data").setBold()));
                table.addCell(new Cell().add(new Paragraph("Energie").setBold()));
                table.addCell(new Cell().add(new Paragraph("Plăcere").setBold()));
                table.addCell(new Cell().add(new Paragraph("Emoție").setBold()));

                for (CheckIn c : checkIns) {
                    table.addCell(FMT.format(c.getCheckedInAt()));
                    table.addCell(String.format("%.1f", c.getEnergy()));
                    table.addCell(String.format("%.1f", c.getPleasantness()));
                    table.addCell(c.getEmotionLabel() != null ? c.getEmotionLabel() : "-");
                }
                doc.add(table);
            }
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }

        return baos.toByteArray();
    }
}
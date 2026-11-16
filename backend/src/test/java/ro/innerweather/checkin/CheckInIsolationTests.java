package ro.innerweather.checkin;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import ro.innerweather.IntegrationTest;

import java.time.YearMonth;
import java.time.ZoneOffset;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// cerinta din plan (B4): userul A nu poate citi check-in-urile userului B
class CheckInIsolationTests extends IntegrationTest {

    @Test
    void userSeesOnlyOwnCheckIns() throws Exception {
        String tokenA = registerUser(uniqueEmail());
        String tokenB = registerUser(uniqueEmail());

        // A face un check-in
        mvc.perform(post("/api/check-ins")
                        .header(HttpHeaders.AUTHORIZATION, bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"energy": 0.5, "pleasantness": 0.7, "emotionLabel": "calm"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.weather").value("SUNNY"));

        // A il vede in lista lui
        mvc.perform(get("/api/check-ins").header(HttpHeaders.AUTHORIZATION, bearer(tokenA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].emotionLabel").value("calm"));

        // B nu vede nimic, nici in lista, nici in calendar
        mvc.perform(get("/api/check-ins").header(HttpHeaders.AUTHORIZATION, bearer(tokenB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        String thisMonth = YearMonth.now(ZoneOffset.UTC).toString(); // ex. 2026-11
        mvc.perform(get("/api/check-ins/calendar")
                        .param("month", thisMonth)
                        .header(HttpHeaders.AUTHORIZATION, bearer(tokenB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void checkInOutsideScaleReturnsFieldError() throws Exception {
        String token = registerUser(uniqueEmail());

        mvc.perform(post("/api/check-ins")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"energy": 3.0, "pleasantness": 0.2}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors.energy").exists());
    }

    @Test
    void checkInsWithoutTokenReturnUnauthorized() throws Exception {
        mvc.perform(get("/api/check-ins"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }
}

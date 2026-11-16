package ro.innerweather.common;

import java.util.Map;

// formatul unic de eroare din contractul API: {code, message, fieldErrors}
public record ApiError(
        String code,                       // cod stabil, pe care frontend-ul poate face switch
        String message,                    // text pentru om
        Map<String, String> fieldErrors) { // camp -> mesaj; gol daca eroarea nu tine de un camp

    public static ApiError of(String code, String message) {
        return new ApiError(code, message, Map.of());
    }
}

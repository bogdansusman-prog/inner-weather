package ro.innerweather.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotNull AccountType accountType,
        @Size(max = 8) String therapistCode,   // obligatoriu pentru CLIENT
        @Size(max = 50) String licenseNumber) { // obligatoriu pentru THERAPIST
}
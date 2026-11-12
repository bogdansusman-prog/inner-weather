package ro.innerweather.user;

import ro.innerweather.therapist.TherapistStatus;

import java.util.UUID;

// ce afla frontend-ul despre contul logat
public record MeResponse(
        UUID id,
        String email,
        String name,
        Role role,
        TherapistStatus therapistStatus, // doar pentru terapeuti
        String inviteCode) {             // doar pentru terapeuti aprobati
}
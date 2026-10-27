package com.urlshortener.util;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;

public final class NoteExpirationHelper {

    private NoteExpirationHelper() {}

    /**
     * Allowed expiration values in MINUTES.
     * 30m, 1h, 6h, 12h, 24h, 3d, 7d, 15d, 30d
     */
    public static final Set<Integer> ALLOWED_EXPIRATION_MINUTES =
            Set.of(30, 60, 360, 720, 1440, 4320, 10080, 21600, 43200);

    public static void validateExpirationHours(Integer expirationHours) {
        // Accept both legacy hour-based values and the new minutes-based values
        // Frontend sends minutes now (30, 60, 360, 720, 1440, 4320, 10080, 21600, 43200)
        if (expirationHours == null || !ALLOWED_EXPIRATION_MINUTES.contains(expirationHours)) {
            throw new IllegalArgumentException(
                    "Expiration must be one of: 30, 60, 360, 720, 1440, 4320, 10080, 21600, or 43200 minutes");
        }
    }

    /**
     * Calculate expiration instant.
     * The parameter is now interpreted as MINUTES (field name kept for backward compat with DTOs).
     */
    public static Instant calculateExpiresAt(int expirationMinutes) {
        return Instant.now().plus(Duration.ofMinutes(expirationMinutes));
    }

    public static String computeRemainingTime(Instant expiresAt) {
        if (expiresAt == null || expiresAt.isBefore(Instant.now())) {
            return "Expired";
        }

        Duration duration = Duration.between(Instant.now(), expiresAt);
        long totalMinutes = duration.toMinutes();
        long days = duration.toDays();
        long hours = duration.toHours();
        long minutes = totalMinutes % 60;

        LocalDate expireDate = expiresAt.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate tomorrow = LocalDate.now(ZoneId.systemDefault()).plusDays(1);
        if (expireDate.equals(tomorrow) && days < 2) {
            return "tomorrow";
        }

        if (days >= 1) {
            return days + (days == 1 ? " day" : " days");
        }
        if (hours >= 1) {
            return hours + (hours == 1 ? " hour" : " hours");
        }
        if (totalMinutes >= 1) {
            return totalMinutes + (totalMinutes == 1 ? " minute" : " minutes");
        }
        return "less than a minute";
    }
}

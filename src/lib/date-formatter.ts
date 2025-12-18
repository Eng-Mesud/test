// src/lib/date-formatter.ts

/**
 * Formats a UTC ISO string to a human-readable local date and time.
 * Example: 2023-10-27T10:00:00Z -> "Oct 27, 2023, 1:00 PM"
 */
export function formatDateTime(dateString: string | Date | undefined) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

/**
 * Formats for tables where space is tight.
 * Example: "10/27/2023"
 */
export function formatDate(dateString: string | Date | undefined) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(date);
}
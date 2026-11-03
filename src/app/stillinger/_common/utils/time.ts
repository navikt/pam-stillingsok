const timeFormatter = new Intl.DateTimeFormat("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
});

export function formatLocalTime(date: Date): string {
    return timeFormatter.format(date);
}

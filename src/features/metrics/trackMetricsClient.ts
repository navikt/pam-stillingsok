export type MetricsEventName = "Vurdering - Sokeresultat" | "Valg - Cookie samtykke";

export function trackMetricsClient<Name extends MetricsEventName>(
    eventName: Name,
    eventData: Readonly<Record<string, string>>,
) {
    fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName, eventData }),
        keepalive: true, // Sørg for at forespørselen fullføres selv om brukeren navigerer bort
    }).catch(() => {
        // Ignorer feil, vi ønsker ikke å forstyrre brukeropplevelsen
    });
}

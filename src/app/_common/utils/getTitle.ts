export function getSoknadSendtTitle(employerName?: string): string {
    if (employerName && employerName.trim() !== "") {
        return `Søknaden din til ${employerName} er sendt`;
    }
    return "Søknaden er sendt til arbeidsgiver";
}

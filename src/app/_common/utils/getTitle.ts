export function getSoknadSendtTitle(employerName?: string): string {
    if (employerName && employerName.trim() !== "") {
        return `Søknaden din til ${employerName.trim()} er sendt`;
    }
    return "Søknaden er sendt til arbeidsgiver";
}

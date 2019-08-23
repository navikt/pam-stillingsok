export default function analytics(...props) {
    if (window.ga) {
        window.ga(...props);
    }
}

/**
 * Viser om innlogget bruker har valgt "arbeidsgiver" eller "personbruker" når de logget inn.
 * Hvis bruker allerede er innlogget, f.eks på nav.no, vet vi ikke rollen enda ("ukjent").
 */
export function trackAuthenticationRole() {
    analytics('send', 'event', 'Authentication', 'role', localStorage.getItem('innloggetBrukerKontekst') || 'ukjent');
}

/**
 * Vi ønsker å vite hvor mange favoritter det er vanlig å ha. Og så vil vi gjerne
 * vite om det er noen brukere som har veldig mange favoritter, og om vi bør innføre paging eller
 * opprydding av gamle favoritter.
 * @param total
 */
export function trackTotalFavourites(total) {
    analytics('send', 'event', 'Favoritter', 'fetchTotalElements', total);
}

/**
 * Viser hvor mange bruker print-knappen på stillingsiden.
 */
export function trackStillingPrint() {
    analytics('send', 'event', 'Stilling', 'print');
}

export function labelForEducation(key: string) {
    switch (key) {
        case "Ingen krav":
            return "Ingen krav til utdanning";
        case "Master":
            return "Master eller tilsvarende";
        case "Videregående":
            return "Videregående skole";
        case "Fagbrev":
            return "Fag- eller svennebrev";
        case "Fagskole":
            return "Fagskole eller tilsvarende";
        case "Bachelor":
            return "Bachelor eller tilsvarende";
        default:
            return key;
    }
}
export function labelForExperience(key: string) {
    switch (key) {
        case "ingen krav til arbeidserfaring":
        case "Ingen":
            return "Ingen krav til arbeidserfaring";
        case "noe arbeidserfaring":
        case "Noe":
            return "Noe arbeidserfaring";
        case "mye arbeidserfaring":
        case "Mye":
            return "Mye arbeidserfaring";
        default:
            return key;
    }
}

export function labelForNeedDriversLicense(key: string) {
    switch (key) {
        case "true":
            return "Må ha førerkort";
        case "false":
            return "Trenger ikke førerkort";
        default:
            return key;
    }
}

export function labelForUnder18(key: string): string {
    switch (key) {
        case "true": {
            return "Kan passe for deg under 18 år";
        }
        case "false": {
            return "18 år eller over";
        }
        default: {
            return key;
        }
    }
}

export function labelForSummerJob(key: string): string {
    switch (key) {
        case "true": {
            return "Sommerjobb";
        }
        default: {
            return key;
        }
    }
}

export function labelForHasSuperraskSoknad(key: string): string {
    switch (key) {
        case "true": {
            return "Superrask søknad";
        }
        default: {
            return key;
        }
    }
}

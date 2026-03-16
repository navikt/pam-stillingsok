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
        case "Ingen":
            return "Ingen krav til arbeidserfaring";
        case "Noe":
            return "Noe arbeidserfaring (1-3år)";
        case "Mye":
            return "Mye arbeidserfaring (4år+)";
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

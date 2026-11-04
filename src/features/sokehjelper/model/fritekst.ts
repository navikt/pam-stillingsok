import { containsEmail, containsValidFnrOrDnr } from "@/app/stillinger/_common/utils/utils";

export const MAX_FRITEKST_LENGTH = 100;

/** Samme regler som fritekstsøket på søkesiden. Brukes både i skjemaet og på serveren. */
export function getFritekstFeil(value: string): string | undefined {
    // Lengden sjekkes først slik at regexene aldri kjører på lange strenger
    if (value.length > MAX_FRITEKST_LENGTH) {
        return `Teksten kan ikke ha mer enn ${MAX_FRITEKST_LENGTH} tegn`;
    }
    if (containsValidFnrOrDnr(value) || containsEmail(value)) {
        return "Teksten kan inneholde personopplysninger. Dette er ikke tillatt av personvernhensyn.";
    }
    return undefined;
}

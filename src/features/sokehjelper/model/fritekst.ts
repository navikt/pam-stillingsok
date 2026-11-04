import { containsEmail, containsValidFnrOrDnr } from "@/app/stillinger/_common/utils/utils";

export const MAX_FRITEKST_LENGTH = 100;

/** Samme regler som fritekstsøket på søkesiden. Brukes både i skjemaet og på serveren. */
export function getFritekstFeil(value: string): string | undefined {
    if (containsValidFnrOrDnr(value) || containsEmail(value)) {
        return "Teksten kan inneholde personopplysninger. Dette er ikke tillatt av personvernhensyn.";
    }
    if (value.length > MAX_FRITEKST_LENGTH) {
        return `Teksten kan ikke ha mer enn ${MAX_FRITEKST_LENGTH} tegn`;
    }
    return undefined;
}

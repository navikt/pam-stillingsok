import { isValid, parseISO } from "date-fns";
import { format as formatDateFns } from "date-fns/format";
import { nb } from "date-fns/locale";
import { IsoDateString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

/** Returnerer tekst for oppstart basert på ny modell (date/label). */
export function getStartText(start: {
    startDate?: IsoDateString | null;
    startDateLabel?: string | null;
}): string | undefined {
    const { startDate, startDateLabel } = start;

    if (typeof startDate === "string" && startDate.length > 0) {
        const d = parseISO(startDate);
        if (isValid(d)) {
            return formatDateFns(d, "d. MMMM yyyy", { locale: nb });
        }
    }

    const label = (startDateLabel ?? "").trim();
    return label.length > 0 ? label : undefined;
}

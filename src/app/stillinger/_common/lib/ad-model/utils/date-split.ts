import { isValid, parseISO } from "date-fns";
import { format as formatDateFns, parse } from "date-fns";
import { IsoDateString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

export type IsoDateTimeString =
    `${number}${number}${number}${number}-${number}${number}-${number}${number}T${number}${number}:${number}${number}:${number}${number}.${number}${number}${number}Z`;

type Split = { date: IsoDateString; label: undefined } | { date: undefined; label: string | undefined };

export function splitDateOrLabel(input: string | null | undefined): Split {
    const raw = (input ?? "").trim();
    if (raw.length === 0) return { date: undefined, label: undefined };

    const iso = parseISO(raw);
    if (isValid(iso)) return { date: toIsoDateOnly(iso), label: undefined };

    const formats: readonly string[] = ["dd.MM.yyyy", "d.M.yyyy", "dd-MM-yyyy", "d-M-yyyy", "dd/MM/yyyy", "d/M/yyyy"];
    for (const f of formats) {
        const d = parse(raw, f, new Date());
        if (isValid(d)) return { date: toIsoDateOnly(d), label: undefined };
    }
    return { date: undefined, label: raw };
}

export function toIsoDateOnly(d: Date): IsoDateString {
    return formatDateFns(d, "yyyy-MM-dd") as IsoDateString;
}

export function dateOnlyToUtcDateTime(dateOnly: IsoDateString): IsoDateTimeString {
    // Sett til UTC midnatt – oppfyller z.string().datetime()
    const d = new Date(`${dateOnly}T00:00:00.000Z`);
    return d.toISOString() as IsoDateTimeString;
}

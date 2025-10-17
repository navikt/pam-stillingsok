import { addDays, isSameDay, isValid, parseISO } from "date-fns";
import { format as formatDateFns } from "date-fns/format";
import { nb } from "date-fns/locale";
import { type IsoDateString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

type Args = {
    dueDateIso?: IsoDateString | null;
    dueLabel?: string | null;
    now?: Date;
};

export default function getDeadlineMessage({ dueDateIso, dueLabel, now = new Date() }: Args) {
    const label = (dueLabel ?? "").trim();
    const hasLabel = label.length > 0;
    const hasDate = typeof dueDateIso === "string" && (dueDateIso as string).length > 0;

    // Hvis label finnes og er "asap/snarest" → standardtekst
    if (hasLabel) {
        const lower = label.toLowerCase();
        if (lower.includes("asap") || lower.includes("snarest")) {
            return "Søk snarest mulig";
        }
    }

    // Hvis ISO-dato finnes vis relativ tekst
    if (hasDate) {
        const parsed = parseISO(dueDateIso as string);
        if (isValid(parsed)) {
            if (isSameDay(now, parsed)) return "Søk senest i dag";
            if (isSameDay(addDays(now, 1), parsed)) return "Søk senest i morgen";
            if (isSameDay(addDays(now, 2), parsed)) return "Søk senest i overmorgen";
            return `Søk senest ${formatDateFns(parsed, "EEEE d. MMMM", { locale: nb })}`;
        }
    }

    if (hasLabel) {
        return `Frist: ${label}`;
    }

    return undefined;
}

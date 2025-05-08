import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";

export function formatWorkdaysString(workdays: string | null | undefined): string | null {
    if (workdays == null) {
        return null;
    }

    const days = ["søndag", "ukedager", "lørdag"];
    if (days.every((day) => workdays.toLowerCase().includes(day))) {
        return "Alle dager";
    }
    return `${joinStringWithSeparator(workdays.split(", "))}`;
}

export function formatWorkTimeString(workTime: string | null | undefined): string | null {
    if (workTime == null) {
        return null;
    }

    return `${joinStringWithSeparator(workTime.split(", "))}`;
}

export function joinArbeidstider(
    jobArrangement: string | null | undefined,
    workTime: string | null | undefined,
    workdays: string | null | undefined,
): string {
    const listArbeidstider = [jobArrangement, formatWorkTimeString(workTime), formatWorkdaysString(workdays)].filter(
        (el) => el != null,
    );
    return joinStringWithSeparator(listArbeidstider, ", ", true, false);
}

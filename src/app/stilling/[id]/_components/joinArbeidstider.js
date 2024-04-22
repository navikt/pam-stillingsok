import joinStringWithSeparator from "@/app/_common/utils/joinStringWithSeperator";

export function formatWorkdaysString(workdays) {
    if (workdays === undefined || workdays === null) {
        return null;
    }

    const days = ["søndag", "ukedager", "lørdag"];
    if (days.every((day) => workdays.toLowerCase().includes(day))) {
        return "Alle dager";
    }
    return `${joinStringWithSeparator(workdays.split(", "))}`;
}

export function formatWorkTimeString(workTime) {
    if (workTime === undefined || workTime === null) {
        return null;
    }

    return `${joinStringWithSeparator(workTime.split(", "))}`;
}

export function joinArbeidstider(jobArrangement, workTime, workdays) {
    const listArbeidstider = [jobArrangement, formatWorkTimeString(workTime), formatWorkdaysString(workdays)].filter(
        (el) => el !== null && el !== undefined,
    );
    return joinStringWithSeparator(listArbeidstider, ", ", true, false);
}

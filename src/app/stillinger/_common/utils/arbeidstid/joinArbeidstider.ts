import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";
import { capitalizeFirst } from "@/app/stillinger/_common/utils/text/casing";
import { formatWorkdaysString, formatWorkTimeString } from "@/app/stillinger/_common/utils/arbeidstid";

type NullableString = string | null | undefined;

export function joinArbeidstider(
    jobArrangement: NullableString,
    workTime: ReadonlyArray<string> | null | undefined,
    workdays: ReadonlyArray<string> | null | undefined,
): string {
    const workTimeStr = formatWorkTimeString(workTime);
    const workdaysStr = formatWorkdaysString(workdays);

    const parts: string[] = [];

    if (jobArrangement) {
        parts.push(jobArrangement);
        if (workTimeStr) parts.push(workTimeStr);
    } else if (workTimeStr) {
        parts.push(capitalizeFirst(workTimeStr));
    }

    if (workdaysStr) parts.push(workdaysStr);

    return joinStringWithSeparator(parts, ", ", true, false);
}

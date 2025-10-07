import { parseStringList, type StringListInput } from "@/app/stillinger/_common/utils/text/listParsing";
import { dedupeStringsPreserveFirst } from "@/app/stillinger/_common/utils/text/dedupe";
import { applyCasing, type LowercaseMode } from "@/app/stillinger/_common/utils/text/casing";
import { formatNbList } from "@/app/stillinger/_common/utils/text/nbFormat";

export function formatWorkTimeString(
    workTime: StringListInput,
    opts?: {
        useCustomJoin?: (values: readonly string[]) => string;
        lowercaseMode?: LowercaseMode;
    },
): string | null {
    const parsed = parseStringList(workTime);
    if (!parsed) return null;

    const unique = dedupeStringsPreserveFirst(parsed);
    const mode: LowercaseMode = opts?.lowercaseMode ?? "exceptFirst";
    const display = applyCasing(unique, mode);

    const joiner = opts?.useCustomJoin ?? formatNbList;
    return joiner(display);
}

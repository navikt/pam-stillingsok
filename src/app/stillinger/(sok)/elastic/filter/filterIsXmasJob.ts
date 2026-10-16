import type { TermFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterIsXmasJob(isXmasJob?: boolean): TermFilter[] {
    if (!isXmasJob) {
        return [];
    }

    return [
        {
            term: {
                "generatedSearchMetadata.xmasJobMetadata.isXmasJob": true,
            },
        },
    ];
}

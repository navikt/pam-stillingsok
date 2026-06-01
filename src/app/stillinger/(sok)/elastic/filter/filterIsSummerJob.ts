export function filterIsSummerJob(isSummerJob: boolean | undefined) {
    if (isSummerJob) {
        return [
            {
                term: {
                    "generatedSearchMetadata.summerJobMetadata.isSummerJob": true,
                },
            },
        ];
    }
    return [];
}

import { formatCountWithNoun } from "@/app/_common/i18n/nbPlural";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";

const job = { singular: "jobb", plural: "jobber" } as const;
const ad = { singular: "annonse", plural: "annonser" } as const;

export function formatSearchSummary(jobCount: number, adCount: number): string {
    const jobsText = formatCountWithNoun(jobCount, job, formatNumber);
    const adsText = formatCountWithNoun(adCount, ad, formatNumber);

    return `Vi fant ${jobsText} i ${adsText}!`;
}

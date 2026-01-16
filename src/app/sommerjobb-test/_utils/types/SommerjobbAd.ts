import { type StillingSoekResponseExplanation } from "@/server/schemas/stillingSearchSchema";

export type SommerjobbAd = {
    uuid: string;
    title: string;
    description: string;
    employer: {
        name: string;
    };
    location: string;
    applicationDue: string;
    explanation: StillingSoekResponseExplanation | undefined;
    searchtagsai?: string[];
    generatedSearchMetadata?: {
        properties: {
            isSummerJob: boolean;
        };
    };
};

import { type StillingSoekResponseExplanation } from "@/server/schemas/stillingSearchSchema";

export type Mulighet = {
    uuid: string;
    title: string;
    description: string;
    employer: {
        name: string;
    };
    location: string;
    applicationDue: string;
    explanation: StillingSoekResponseExplanation | undefined;
};

import { z } from "zod";

const _MetricsEventSchema = z.object({
    eventId: z.uuid(),
    createdAt: z.date(),
    eventName: z.string(),
    eventData: z.record(z.string(), z.string()).nullable(),
});

export type MetricsEvent = z.infer<typeof _MetricsEventSchema>;

export type MetricsEventTemplate = {
    "Vurdering - Sokeresultat": {
        value: SearchRating;
    };
    "Valg - Cookie samtykke": {
        action: "no-action" | "accepted-analytics" | "not-accepted-analytics";
    };
};
export type MetricsEventName = keyof MetricsEventTemplate;

export type SearchRating = "Ja" | "Nei";

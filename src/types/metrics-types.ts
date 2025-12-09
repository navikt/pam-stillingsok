import { z } from "zod";

const MetricsEventSchema = z.object({
    eventId: z.uuid(),
    createdAt: z.date(),
    eventName: z.string(),
    eventData: z.record(z.string(), z.unknown()).nullable(),
});

export type MetricsEvent = z.infer<typeof MetricsEventSchema>;

export type SearchResultRating = "Ja" | "Nei";

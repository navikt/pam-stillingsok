import { z } from "zod";

/** ISO 8601 med offset/Z, f.eks. 2025-10-02T08:00:00Z */
export const IsoDateTimeString = z.iso.datetime({ offset: true });
export type IsoDateTimeString = z.infer<typeof IsoDateTimeString>;
export const IsoDateString = z.iso.date();
export type IsoDateString = z.infer<typeof IsoDateString>;

export const UrlString = z.url();
export type UrlString = z.infer<typeof UrlString>;

export const EmailString = z.email();
export type EmailString = z.infer<typeof EmailString>;

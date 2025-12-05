import { regexes, z } from "zod";

/** ISO 8601 med offset/Z, f.eks. 2025-10-02T08:00:00Z */
export const IsoDateTimeStringSchema = z.iso.datetime({ offset: true });
export type IsoDateTimeString = z.infer<typeof IsoDateTimeStringSchema>;
export const IsoDateStringSchema = z.iso.date();
export type IsoDateString = z.infer<typeof IsoDateStringSchema>;

export const UrlStringSchema = z.url();
export type UrlString = z.infer<typeof UrlStringSchema>;

export const EmailStringSchema = z.email({ pattern: regexes.unicodeEmail });

export type EmailString = z.infer<typeof EmailStringSchema>;

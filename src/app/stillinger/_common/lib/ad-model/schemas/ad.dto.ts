import { z } from "zod";
import { EmailString, IsoDateString, UrlString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

/** TODO: er nødt til å vite på generell basis
 * om felter kan ha verdi null eller om de er optionale
 * felter som kan få ferdi null må vi håndtere eksplisitt
 */
/** Subtyper */
export const Contact = z.object({
    name: z.string().optional(),
    email: EmailString.optional(),
    phone: z.string().nullish(),
    role: z.string().nullish(),
    title: z.string().optional(),
});
export type Contact = z.infer<typeof Contact>;

export const Location = z.object({
    address: z.string().optional(),
    postalCode: z.string().optional(),
    county: z.string().optional(),
    municipal: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
});
export type Location = z.infer<typeof Location>;

export const Employer = z.object({
    name: z.string().optional(),
    orgnr: z.string().optional(),
    sector: z.string().optional(),
    homepage: UrlString.optional(),
    linkedinPage: UrlString.optional(),
    twitterAddress: UrlString.optional(),
    facebookPage: UrlString.optional(),
    descriptionHtml: z.string().optional(), // Sanitert HTML om det er mulighet for html???
});
export type Employer = z.infer<typeof Employer>;

/** Hovedmodell – målformatet backend skal levere */
export const AdDTO = z.object({
    id: z.string(),
    status: z.string().optional(),
    title: z.string().optional(),
    /** Hva er forskjellen på source og medium, ser
     * for meg ut som de to har samme verdi. men begge er i bruk i frontend
     * trenger vi bare en?*/
    source: z.string().optional(),
    medium: z.string().optional(),
    reference: z.string().optional(),

    // Fetdig iso date fra backend på disse
    published: IsoDateString.optional(),
    updated: IsoDateString.optional(),
    expires: IsoDateString.optional(),
    // Litt missvisende navn, oppdatter det som at det er en dato
    // Men er bare en streng  med "Snarest" Navngivning??
    applicationDue: z.string().optional(),

    hasSuperraskSoknad: z.boolean().optional(),
    // ikke i bruk i koden, sjekker om "arb-aapningstekst" fins i AdText da er det strukturert i AdText.tsx
    // forslag: kanskje fjernes??
    adTextFormat: z.string().optional(),
    // Klarer ikke se at dette er i bruk i koden, fjernes??
    businessName: z.string().optional(),
    // er dette en streng eller kan det være en enum
    engagementType: z.string().optional(),
    // Er dette en streng eller kan det være en enum
    jobArrangement: z.string().optional(),
    jobTitle: z.string().optional(),
    positionCount: z.number().int().positive().optional(),
    // Litt usikker på navn her oppfatter det som en boolsk verdi
    // Men er "Hybridkontor", "Hjemmekontor", "Hjemmekontor ikke mulig" som jeg kan se
    remote: z.string().optional(),
    // oppfatter dette som den date, men er eks "Etter avtale", "Snarest",
    // navngiving??
    startTime: z.string().optional(),

    // Sørge for at disse alltid er arrays fra backend
    extent: z.array(z.string()).optional(),
    workdays: z.array(z.string()).optional(),
    workHours: z.array(z.string()).optional(),

    //Bearbeides i backend med % ??
    jobPercentage: z
        .string()
        .regex(/^\d{1,3}%$/)
        .optional(),
    //Bearbeides i backend med % ??
    jobPercentageRange: z
        .string()
        .regex(/^\d{1,3}%\s*-\s*\d{1,3}%$/)
        .optional(),

    workLanguages: z.array(z.string()).optional(),
    /** Sanitiserer annonsetekst og linkifiserer e-postadresser.
     * Endre navn til hva det faktisk er slaks type tekst (HTML)*/
    adTextHtml: z.string().optional(),
    applicationEmail: EmailString.optional(),
    applicationUrl: UrlString.optional(),
    sourceUrl: UrlString.optional(),

    // Sørge for at denne modellen er satt sammen fra backend
    // Se scema over for felter
    employer: Employer.optional(),
    contactList: z.array(Contact).optional(),

    // Ser fra gammel kode at location blir satt fra properties
    // og at den er i bruk. men kan vi klare oss med en?
    // hva er forskjellen?
    locationList: z.array(Location).optional(),
    location: z.string().optional(),
    // Denne er bare noe jeg har lagt til nå for å kunne vise
    // feilmelding til bruker dersom zod krasjer på model issues
    isZodError: z.boolean().optional(),
});
export type AdDTO = z.infer<typeof AdDTO>;

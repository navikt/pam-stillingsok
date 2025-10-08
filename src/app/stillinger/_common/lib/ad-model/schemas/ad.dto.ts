import { z } from "zod";
import { EmailString, IsoDateTimeString, UrlString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

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
    orgnr: z.string().optional(),
    name: z.string().optional(), // Ska vara businessName in här (Legg inn koden)
    sector: z.string().optional(),
    homepage: UrlString.optional(),
    // C: Är det här faktiskt fulla URL-er eller bara ID? Blandningen av page och address gör lite ont i ögonen
    //S:    Legg inn kode for hvordan url håndteres i dag og sanitering
    linkedinPage: UrlString.optional(),
    twitterAddress: UrlString.optional(), //
    facebookPage: UrlString.optional(),
    descriptionHtml: z.string().optional(), // Sanitert HTML om det er mulighet for html???
});
export type Employer = z.infer<typeof Employer>;

export const Application = z.object({
    // Parsea och populera i backend
    applicationDueDate: IsoDateTimeString.optional() /** properties.applicationdue */,
    applicationDueLabel: z.string().optional() /** properties.applicationdue */,
    hasSuperraskSoknad: z.boolean().optional() /** properties.hasInterestform */,
    // C: Borde vi lägga in application i en egen subtyp också, där vi har de här två + superrask     søknad? Eller i
    applicationEmail: EmailString.optional() /** properties.applicationemail */,
    applicationUrl: UrlString.optional() /** properties.applicationurl */,
});
export type Application = z.infer<typeof Application>;

/** Hovedmodell – målformatet backend skal levere */
export const AdDTO = z.object({
    id: z.string(), // UUID
    status: z.string().optional(), // enum ACTIVE INACTIVE (och STOPPED? tror inte)
    title: z.string().optional(),
    source: z.string().optional(),
    reference: z.string().optional(),
    medium: z.string().optional(),

    // Fetdig iso date fra backend på disse
    published: IsoDateTimeString.optional(),
    updated: IsoDateTimeString.optional(),
    expires: IsoDateTimeString.optional(),
    application: Application /** properties */,

    // ikke i bruk i koden, sjekker om "arb-aapningstekst" fins i AdText da er det strukturert i AdText.tsx
    // forslag: kanskje fjernes??
    // S: enum bruk denne for strukturert sjekk
    adTextFormat: z.string().optional() /** properties.adtextFormat */,
    // er dette en streng eller kan det være en enum
    // M: er enum i pam-ad (EngagementType.kt), så yes?
    engagementType: z.string().optional() /** properties.engagementtype */,
    // Er dette en streng eller kan det være en enum
    // M: brukes egentlig denne? Ser det er kun i EmploymentDetails, men er det faktisk data i det feltet? Properties ble opprettet for sånn 7 år siden.
    //S: Er det noe data på dette feltet
    jobArrangement: z.string().optional() /** properties.jobarrangement */,
    jobTitle: z.string().optional() /** properties.jobtitle */,
    positionCount: z.number().int().positive().optional() /** properties.positioncount */,
    // Litt usikker på navn her oppfatter det som en boolsk verdi
    // Men er "Hybridkontor", "Hjemmekontor", "Hjemmekontor ikke mulig" som jeg kan se
    // C: remoteOptions?
    // O: jobLocationType?
    remoteOptions: z.string().optional() /** properties - enum? */,
    // oppfatter dette som en date, men er eks "Etter avtale", "Snarest",
    // navngiving??
    startDate: IsoDateTimeString.optional() /** properties.startTime*/,
    startDateLabel: z.string().optional() /** properties.startTime*/,
    // Sørge for at disse alltid er arrays fra backend
    // sjekk eksisterende data
    extent: z.array(z.string()).optional() /** properties.extent */,
    workDays: z.array(z.string()).optional() /** properties.workday */,
    workHours: z.array(z.string()).optional() /** properties.workhours */,

    // sjekk data, lage et felt for dette
    jobPercentage: z.string().optional() /** properties */,

    workLanguages: z.array(z.string()).optional() /** properties.workLanguage */,
    /** Sanitiserer annonsetekst og linkifiserer e-postadresser.
     * Endre navn til hva det faktisk er slaks type tekst (HTML)*/
    adTextHtml: z.string().optional() /** properties */,
    sourceUrl: UrlString.optional() /** properties */,

    // Sørge for at denne modellen er satt sammen fra backend
    // Se scema over for felter
    employer: Employer.optional() /** properties og src */,
    contactList: z.array(Contact).optional(),

    // Ser fra gammel kode at location blir satt fra properties
    // og at den er i bruk. men kan vi klare oss med en?
    // hva er forskjellen?
    // C: Rydde i backend när någon lagt in fylke, kommune och by, som är samma
    locationList: z.array(Location).optional(),
    // Denne er bare noe jeg har lagt til nå for å kunne vise
    // feilmelding til bruker dersom zod krasjer på model issues
    isZodError: z.boolean().optional(),
});
export type AdDTO = z.infer<typeof AdDTO>;

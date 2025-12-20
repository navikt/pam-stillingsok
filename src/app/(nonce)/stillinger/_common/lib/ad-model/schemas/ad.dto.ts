import { z } from "zod";
import {
    EmailStringSchema,
    IsoDateTimeStringSchema,
    UrlStringSchema,
} from "@/app/(nonce)/stillinger/_common/lib/ad-model/schemas/primitives";

/** TODO: finn ut hvilke felter som er required og legg til .nonnullable() der det trengs
 */
/** Subtyper */
export const ContactSchema = z.object({
    name: z.string().nullable(),
    email: EmailStringSchema.nullable(),
    phone: z.string().nullish(),
    role: z.string().nullish(),
    title: z.string().nullable(),
});
export type Contact = z.infer<typeof ContactSchema>;

export const LocationSchema = z.object({
    address: z.string().nullable(),
    postalCode: z.string().nullable(),
    county: z.string().nullable(),
    municipal: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
});
export type Location = z.infer<typeof LocationSchema>;

export const EmployerSchema = z.object({
    orgnr: z.string().nullable(),
    name: z.string().nullable(), // Ska vara businessName in här (Legg inn koden)
    sector: z.string().nullable(),
    homepage: UrlStringSchema.nullable(),
    // C: Är det här faktiskt fulla URL-er eller bara ID? Blandningen av page och address gör lite ont i ögonen
    //S:    Legg inn kode for hvordan url håndteres i dag og sanitering
    linkedinPage: UrlStringSchema.nullable(),
    twitterAddress: UrlStringSchema.nullable(), //
    facebookPage: UrlStringSchema.nullable(),
    descriptionHtml: z.string().nullable(), // Sanitert HTML om det er mulighet for html???
});
export type Employer = z.infer<typeof EmployerSchema>;

export const ApplicationSchema = z.object({
    // Parsea och populera i backend
    applicationDueDate: IsoDateTimeStringSchema.nullable() /** properties.applicationdue */,
    applicationDueLabel: z.string().nullable() /** properties.applicationdue */,
    hasSuperraskSoknad: z.boolean().nullable() /** properties.hasInterestform */,
    // C: Borde vi lägga in application i en egen subtyp också, där vi har de här två + superrask     søknad? Eller i
    applicationEmail: EmailStringSchema.nullable() /** properties.applicationemail */,
    applicationUrl: UrlStringSchema.nullable() /** properties.applicationurl */,
});
export type Application = z.infer<typeof ApplicationSchema>;

/** Hovedmodell – målformatet backend skal levere */
export const AdDTOSchema = z.object({
    id: z.string(), // UUID
    status: z.string().nullable(), // enum ACTIVE INACTIVE (och STOPPED? tror inte)
    title: z.string().nullable(),
    source: z.string().nullable(),
    reference: z.string().nullable(),
    medium: z.string().nullable(),

    // Fetdig iso date fra backend på disse
    published: IsoDateTimeStringSchema.nullable(),
    updated: IsoDateTimeStringSchema.nullable(),
    expires: IsoDateTimeStringSchema.nullable(),
    application: ApplicationSchema /** properties */,

    // ikke i bruk i koden, sjekker om "arb-aapningstekst" fins i AdText da er det strukturert i AdText.tsx
    // forslag: kanskje fjernes??
    // S: enum bruk denne for strukturert sjekk
    adTextFormat: z.string().nullable() /** properties.adtextFormat */,
    // er dette en streng eller kan det være en enum
    // M: er enum i pam-ad (EngagementType.kt), så yes?
    engagementType: z.string().nullable() /** properties.engagementtype */,
    // Er dette en streng eller kan det være en enum
    // M: brukes egentlig denne? Ser det er kun i EmploymentDetails, men er det faktisk data i det feltet? Properties ble opprettet for sånn 7 år siden.
    //S: Er det noe data på dette feltet
    jobArrangement: z.string().nullable() /** properties.jobarrangement */,
    jobTitle: z.string().nullable() /** properties.jobtitle */,
    positionCount: z.number().int().positive().nullable() /** properties.positioncount */,
    // Litt usikker på navn her oppfatter det som en boolsk verdi
    // Men er "Hybridkontor", "Hjemmekontor", "Hjemmekontor ikke mulig" som jeg kan se
    // C: remoteOptions?
    // O: jobLocationType?
    remoteOptions: z.string().nullable() /** properties - enum? */,
    // oppfatter dette som en date, men er eks "Etter avtale", "Snarest",
    // navngiving??
    startDate: IsoDateTimeStringSchema.nullable() /** properties.startTime*/,
    startDateLabel: z.string().nullable() /** properties.startTime*/,
    // Sørge for at disse alltid er arrays fra backend
    // sjekk eksisterende data
    extent: z.array(z.string()).nullable() /** properties.extent */,
    workDays: z.array(z.string()).nullable() /** properties.workday */,
    workHours: z.array(z.string()).nullable() /** properties.workhours */,

    // sjekk data, lage et felt for dette
    jobPercentage: z.string().nullable() /** properties */,

    workLanguages: z.array(z.string()).nullable() /** properties.workLanguage */,
    /** Sanitiserer annonsetekst og linkifiserer e-postadresser.
     * Endre navn til hva det faktisk er slaks type tekst (HTML)*/
    adTextHtml: z.string().nullable() /** properties */,
    sourceUrl: UrlStringSchema.nullable() /** properties */,

    // Sørge for at denne modellen er satt sammen fra backend
    // Se scema over for felter
    employer: EmployerSchema /** properties og src */,
    contactList: z.array(ContactSchema).nullable(),

    // Ser fra gammel kode at location blir satt fra properties
    // og at den er i bruk. men kan vi klare oss med en?
    // hva er forskjellen?
    // C: Rydde i backend när någon lagt in fylke, kommune och by, som är samma
    locationList: z.array(LocationSchema).nullable(),
    compositeAdVector: z.array(z.number()).nullish(),
    // Denne er bare noe jeg har lagt til nå for å kunne vise
    // feilmelding til bruker dersom zod krasjer på model issues
    isZodError: z.boolean().nullish(),
});
export type AdDTO = z.infer<typeof AdDTOSchema>;

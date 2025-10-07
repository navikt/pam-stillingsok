import { z } from "zod";

/** Legacy schemas – tilsvarer dagens input */
export const LegacyContact = z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    role: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
});

export const LegacyLocation = z.object({
    address: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    county: z.string().optional().nullable(),
    municipal: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
});

export const LegacyEmployer = z.object({
    name: z.string().optional(),
    orgnr: z.string().optional(),
    sector: z.string().optional(),
    homepage: z.string().optional(),
    linkedinPage: z.string().optional(),
    twitterAddress: z.string().optional(),
    facebookPage: z.string().optional(),
    description: z.string().optional().nullable(),
    location: z.string().optional(),
});

export const LegacyProperties = z.object({
    extent: z.union([z.string(), z.array(z.string()), z.undefined()]),
    workhours: z.union([z.string(), z.array(z.string()), z.undefined()]),
    workday: z.union([z.string(), z.array(z.string()), z.undefined()]),
    applicationdue: z.string().optional(),
    jobtitle: z.string().optional(),
    positioncount: z.string().optional(),
    engagementtype: z.string().optional(),
    employerdescription: z.string().optional(),
    starttime: z.string().optional(),
    remote: z.union([z.string(), z.boolean()]).optional(),
    adtext: z.string().optional(),
    hasInterestform: z.union([z.string(), z.boolean()]).optional(),
    workLanguage: z.array(z.string()).optional(),
    applicationemail: z.string().optional(),
    adtextFormat: z.string().optional(),
    applicationurl: z.string().optional(),
    employer: z.string().optional(),
    sector: z.string().optional(),
    address: z.string().optional(),
    employerhomepage: z.string().optional(),
    linkedinpage: z.string().optional(),
    twitteraddress: z.string().optional(),
    facebookpage: z.string().optional(),
    sourceurl: z.string().optional(),
    jobarrangement: z.string().optional(),
    jobpercentage: z.string().optional(),
    jobpercentagerange: z.string().optional(),
    location: z.string().optional(),
});

export const LegacyAd = z.object({
    reference: z.string().optional(),
    locationList: z.array(LegacyLocation).optional(),
    expires: z.string().optional(),
    businessName: z.string().optional().nullable(),
    id: z.union([z.number(), z.string()]).optional(),
    source: z.string().optional(),
    medium: z.string().optional(),
    published: z.string().optional(),
    title: z.string().optional(),
    updated: z.string().optional(),
    status: z.string().optional(),
    employer: LegacyEmployer.optional(),
    contactList: z.array(LegacyContact).optional(),
    properties: LegacyProperties.optional(),
});

export type LegacyAd = z.infer<typeof LegacyAd>;

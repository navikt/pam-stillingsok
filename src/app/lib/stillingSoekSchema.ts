import { z } from "zod";

import fixLocationName from "@/app/_common/utils/fixLocationName";
import logger from "@/app/_common/utils/logger";
import DOMPurify from "isomorphic-dompurify";
import { addPercentageAtEnd, getAdText, getDate, getExtent, getWorktime } from "@/app/stilling/_data/utils";

export const contactDTOSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    role: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
});

export const categoryDTOSchema = z.object({
    id: z.number().optional(),
    code: z.string(),
    categoryType: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    parentId: z.number().optional().nullable(),
});

export const propertiesSchema = z.object({
    extent: z.union([z.string(), z.array(z.string()), z.undefined()]),
    workhours: z.string().optional(),
    education: z.array(z.string()).optional(),
    workday: z.union([z.string(), z.array(z.string()), z.undefined()]),
    applicationdue: z.string().optional(),
    jobtitle: z.string().optional(),
    positioncount: z.string().optional(),
    engagementtype: z.string().optional(),
    employerdescription: z.string().optional(),
    starttime: z.string().optional(),
    remote: z.string().optional(),
    adtext: z.string().optional(),
    needDriversLicense: z.array(z.string()).optional(),
    under18: z.array(z.string()).optional(),
    hasInterestform: z.string().optional(),
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
    searchtags: z
        .array(
            z.object({
                label: z.string(),
                score: z.number(),
            }),
        )
        .optional(),
    experience: z.array(z.string()).optional(),
});

export const locationSchema = z.object({
    address: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    county: z.string().optional().nullable(),
    municipal: z.string().optional().nullable(),
    municipalCode: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
});

export const urlDTOSchema = z
    .object({
        dangerouslyInvalidUrl: z.string().optional(),
        url: z.string().optional(),
    })
    .optional();

export const employerDTOSchema = z.object({
    locationList: z.array(locationSchema).optional(),
    name: z.string().optional(),
    orgnr: z.string().optional(),
    sector: z.string().optional(),
    homepage: urlDTOSchema,
    linkedinPage: urlDTOSchema,
    twitterAddress: urlDTOSchema,
    facebookPage: urlDTOSchema,
    description: z.string().optional().nullable(),
    location: z.string().optional(),
});

export const adDTORAWSchema = z.object({
    reference: z.string().optional(),
    locationList: z.array(locationSchema).optional(),
    expires: z.string().optional(),
    businessName: z.string().optional().nullable(),
    id: z.number().optional(),
    source: z.string().optional(),
    medium: z.string().optional(),
    published: z.string().optional(),
    title: z.string().optional(),
    updated: z
        .string()
        .transform((dateStr) => new Date(dateStr))
        .optional(),
    status: z.string().optional(),
    employer: employerDTOSchema.optional(),
    contactList: z.array(contactDTOSchema).optional(),
    categoryList: z.array(categoryDTOSchema).optional(),
    properties: propertiesSchema.optional(),
});
export const elasticSearchAdResultSchema = z.object({
    _index: z.string().optional(),
    _id: z.string().optional(),
    _version: z.number().optional(),
    _seq_no: z.number().optional(),
    _primary_term: z.number().optional(),
    found: z.literal(true).optional(),
    _source: adDTORAWSchema,
});

export const transformElasticRawToAdData = elasticSearchAdResultSchema.passthrough().transform(({ _source, _id }) => {
    const properties = _source?.properties;
    return transformAdData(_source, _id, properties);
});

export type AdDTORAWSchema = z.infer<typeof adDTORAWSchema>;
export type UrlDTO = z.infer<typeof urlDTOSchema>;
export type EmployerDTO = z.infer<typeof employerDTOSchema>;
export type ContactDTO = z.infer<typeof contactDTOSchema>;
export type LocationDTO = z.infer<typeof locationSchema>;
export type MappedAdDTO = z.infer<typeof transformElasticRawToAdData>;
type PropertiesDTO = z.infer<typeof propertiesSchema>;

export function transformAdData(
    _source: AdDTORAWSchema,
    _id: string | undefined,
    properties: PropertiesDTO | undefined,
) {
    return {
        id: _id,
        status: _source?.status,
        title: _source?.title,
        source: _source?.source,
        reference: _source?.reference,
        medium: _source?.medium,
        applicationDue: properties?.applicationdue,
        hasSuperraskSoknad: properties?.hasInterestform,
        jobPostingFormat: properties?.adtextFormat,
        adNumber: _source?.id,
        businessName: _source?.businessName,

        // employment details
        engagementType: properties?.engagementtype,
        jobArrangement: properties?.jobarrangement,
        jobTitle: properties?.jobtitle,
        positionCount: properties?.positioncount,
        remote: properties?.remote,
        startTime: properties?.starttime,
        locationList: _source?.locationList,
        location: properties?.location,
        adText: getAdText(properties?.adtext),
        published: getDate(_source?.published),
        expires: getDate(_source?.expires),
        updated: getDate(_source?.updated),
        applicationEmail: properties?.applicationemail,
        applicationUrl: getUrl(properties?.applicationurl),
        sourceUrl: getUrl(properties?.sourceurl),
        extent: getExtent(properties?.extent),
        jobPercentage: addPercentageAtEnd(properties?.jobpercentage),
        jobPercentageRange: addPercentageAtEnd(properties?.jobpercentagerange),
        workLanguages: properties?.workLanguage,
        workdays: getWorktime(properties?.workday),
        workHours: getWorktime(properties?.workhours),

        // Employer
        employer: getEmployerData(_source),
        contactList: _source?.contactList,

        // For debugging
        categoryList: _source?.categoryList,
        searchtags: properties?.searchtags,
        education: properties?.education,
        experience: properties?.experience,
        needDriversLicense: properties?.needDriversLicense,
        under18: properties?.under18,
    };
}
/**
 *  --------------------------- Common Functions ---------------------------
 */

function getUrl(url: string | undefined): UrlDTO | undefined {
    if (url == null) {
        return undefined;
    }
    try {
        const validUrl = new URL(url);
        if (validUrl.protocol.startsWith("http")) {
            return { url: url };
        }
        logger.warn(`getUrl - Invalid protocol: ${validUrl.protocol}`);
        return undefined;
    } catch (error) {
        logger.warn(`getUrl - Invalid URL format: ${url}`, error);
        return { dangerouslyInvalidUrl: url };
    }
}

/**
 *  --------------------------- Employer Data ---------------------------
 */

function getEmployerName(adData: AdDTORAWSchema): string | undefined {
    if (adData.properties?.employer) {
        return adData.properties.employer;
    }
    if (adData.businessName) {
        return adData.businessName;
    }
    if (adData.employer) {
        return adData.employer.name;
    }

    return undefined;
}

function getEmployerId(adData: AdDTORAWSchema): string | undefined {
    if (adData.employer) {
        return adData.employer.orgnr;
    }

    return undefined;
}

function getEmployerLocation(list: LocationDTO[]): string | undefined {
    if (!list) {
        return undefined;
    }

    const employerLocation = [];
    for (let i = 0; i < list.length; i += 1) {
        if (list[i].postalCode) {
            let address = list[i].address ? `${list[i].address}, ` : "";
            address += `${list[i].postalCode} ${fixLocationName(list[i].city)}`;
            employerLocation.push(address);
        } else if (list[i].municipal) {
            employerLocation.push(`${fixLocationName(list[i].municipal)}`);
        } else if (list[i].country) {
            employerLocation.push(`${fixLocationName(list[i].country)}`);
        }
    }

    return employerLocation.join(", ");
}

function getEmployerData(adData: AdDTORAWSchema | undefined): EmployerDTO | undefined {
    if (adData == null) {
        return undefined;
    }
    const employerData: EmployerDTO = {
        name: getEmployerName(adData),
        orgnr: getEmployerId(adData),
        sector: adData.properties?.sector,
        homepage: getUrl(adData.properties?.employerhomepage), // change check in EmployerDetails.tsx
        linkedinPage: getUrl(adData.properties?.linkedinpage), // change check in EmployerDetails.tsx
        twitterAddress: getUrl(adData.properties?.twitteraddress), // change check in EmployerDetails.tsx
        facebookPage: getUrl(adData.properties?.facebookpage), // change check in EmployerDetails.tsx
        description: adData.properties?.employerdescription
            ? DOMPurify.sanitize(adData.properties.employerdescription)
            : undefined,
    };
    if (adData.employer && adData.employer.locationList) {
        employerData.locationList = adData.employer.locationList;
        if (employerData.locationList) {
            const location = getEmployerLocation(employerData.locationList);
            if (location) {
                employerData.location = location;
            }
        }
    }
    return employerData;
}

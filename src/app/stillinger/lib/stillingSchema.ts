import { z } from "zod";

import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import DOMPurify from "isomorphic-dompurify";
import { addPercentageAtEnd, getAdText, getDate, getExtent, getWorktime } from "@/app/stillinger/stilling/_data/utils";
import { isValidUrl } from "@/app/stillinger/_common/utils/utilsts";
import { logger } from "@sentry/utils";

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
    code: z.string().optional(),
    categoryType: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    parentId: z.number().optional().nullable(),
});

export const searchTagDTOSchema = z.object({
    label: z.string(),
    score: z.number(),
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
    searchtags: z.array(searchTagDTOSchema).optional(),
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

export const employerDTOSchema = z.object({
    locationList: z.array(locationSchema).optional(),
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

type AdDTORAWSchema = z.infer<typeof adDTORAWSchema>;

export type EmployerDTO = z.infer<typeof employerDTOSchema>;
export type ContactDTO = z.infer<typeof contactDTOSchema>;
export type LocationDTO = z.infer<typeof locationSchema>;
export type StillingDetaljer = z.infer<typeof transformElasticRawToAdData>;
export function transformAdData(
    _source: z.infer<typeof adDTORAWSchema>,
    _id: string | undefined,
    properties: z.infer<typeof propertiesSchema> | undefined,
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
        applicationUrl: getUrl(properties?.applicationurl, _id),
        sourceUrl: getUrl(properties?.sourceurl, _id),
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

export function getUrl(url: string | undefined, id?: string | number | undefined): string | undefined {
    if (url == null) {
        return undefined;
    }

    if (isValidUrl(url)) {
        // Legg til https:// om protokollen mangler
        if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
        }
        return url;
    } else {
        logger.warn(`getUrl - Ugyldig url: ${url}, id: ${id}`);
        return undefined;
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
        homepage: getUrl(adData.properties?.employerhomepage, adData.id), // change check in EmployerDetails.tsx
        linkedinPage: getUrl(adData.properties?.linkedinpage, adData.id), // change check in EmployerDetails.tsx
        twitterAddress: getUrl(adData.properties?.twitteraddress, adData.id), // change check in EmployerDetails.tsx
        facebookPage: getUrl(adData.properties?.facebookpage, adData.id), // change check in EmployerDetails.tsx
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

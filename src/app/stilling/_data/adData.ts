import { containsEmail, extractEmail, isValidEmail, mailtoInString } from "@/app/_common/utils/utils";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import logger from "@/app/_common/utils/logger";
import {
    AdDTORAW,
    ContactDTO,
    ElasticSearchAdResult,
    EmployerDTO,
    Location,
    MapedAdDTO,
    UrlDTO,
} from "@/app/stilling/_data/types";

/**
 *  --------------------------- Common Functions ---------------------------
 */
function getString(value: unknown): string | undefined {
    if (value && typeof value === "string") {
        return value;
    }
    return undefined;
}

export function getDate(date: unknown): Date | undefined {
    return isIsoString(date) ? new Date(date) : undefined;
}

function getNumber(value: unknown): number | undefined {
    if (value && typeof value === "number") {
        return value;
    }
    return undefined;
}

function getArray<T>(arrayData: T[] | undefined): T[] | undefined {
    return Array.isArray(arrayData) ? arrayData : undefined;
}

function getUrl(url: string): UrlDTO {
    try {
        const validUrl = new URL(url);
        if (validUrl.protocol.startsWith("http")) {
            return { url };
        }
        logger.warn(`getUrl - invalid protocol: ${validUrl.protocol}`);
        return undefined;
    } catch (e) {
        if (url) {
            return { dangerouslyInvalidUrl: url };
        }
    }
    return undefined;
}

function removeUndefinedValues<T extends Record<string, unknown>>(inputObject: T): T {
    return Object.keys(inputObject).reduce((acc, key) => {
        const value = inputObject[key as keyof T];
        if (value !== undefined) {
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as T);
}

function getLocationListData(list: Location[]): Location[] {
    const locationList = getArray<Location>(list);
    if (!locationList) {
        return [];
    }
    return locationList.map(
        (location: Location) =>
            removeUndefinedValues({
                address: getString(location.address),
                city: getString(location.city),
                county: getString(location.county),
                postalCode: getString(location.postalCode),
                municipal: getString(location.municipal),
                country: getString(location.country),
            }) as Location,
    );
}

function getEmail(email?: string): string | undefined {
    return isValidEmail(email) ? email : undefined;
}

function getExtent(extent: string | string[]): string | string[] | undefined {
    if (typeof extent === "string") {
        return getString(extent);
    }

    if (Array.isArray(extent)) {
        return getArray<string>(extent);
    }

    return undefined;
}

function getJobPercentage(value: unknown): string | undefined {
    const jobPercentage = getString(value);
    if (!jobPercentage) {
        return undefined;
    }

    return jobPercentage + (jobPercentage.endsWith("%") ? "" : "%");
}

function getJobPercentageRange(value: unknown): string | undefined {
    const jobPercentageRange = getString(value);
    if (!jobPercentageRange) {
        return undefined;
    }

    return jobPercentageRange + (jobPercentageRange.endsWith("%") ? "" : "%");
}

function getAdText(adText: string): string {
    let processedAdText = adText;
    if (containsEmail(adText)) {
        try {
            const extractedEmails = [...extractEmail(adText)];
            let preprocessedAd = adText.replace(/&#64;/g, "@");
            extractedEmails.forEach((it) => {
                if (isValidEmail(it) && !mailtoInString(preprocessedAd, it)) {
                    preprocessedAd = preprocessedAd.replace(it, `<a rel="nofollow" href="mailto:${it}">${it}</a>`);
                }
            });
            processedAdText = preprocessedAd;
        } catch (err) {
            processedAdText = adText;
        }
    }
    // TODO: double check that sanitizing doesn't remove <section> (see amplitude.js for usage)
    return DOMPurify.sanitize(processedAdText);
}

export function getWorktime(worktime: string): string {
    // Can be one of multiple inputs:
    // "Ukedager Søndag"
    // "Turnus"
    // ["Natt"]
    // ["Ukedager","Søndag"]

    try {
        const jsonArray = JSON.parse(worktime);

        if (!Array.isArray(jsonArray)) {
            return "";
        }

        return jsonArray.filter((e) => typeof e === "string").join(", ");
    } catch (e) {
        return worktime;
    }
}

function getContactList(list: ContactDTO[]): ContactDTO[] | undefined {
    const contactList = getArray(list);
    if (!contactList) {
        return undefined;
    }

    return contactList.map(
        (contact) =>
            removeUndefinedValues({
                name: getString(contact.name),
                title: getString(contact.title),
                phone: getString(contact.phone),
                email: getEmail(contact?.email),
            }) as ContactDTO,
    );
}

/**
 *  --------------------------- Employer Data ---------------------------
 */

function getEmployerName(adData: AdDTORAW): string | undefined {
    if (adData.properties.employer) {
        return getString(adData.properties.employer);
    }
    if (adData.businessName) {
        return getString(adData.businessName);
    }
    if (adData.employer) {
        return getString(adData.employer.name);
    }

    return undefined;
}

function getEmployerId(adData: AdDTORAW): string | undefined {
    if (adData.employer) {
        return getString(adData.employer.orgnr);
    }

    return undefined;
}

function getEmployerLocation(list: Location[]): string | undefined {
    const locationList = getArray(list);
    if (!locationList) {
        return undefined;
    }

    const employerLocation = [];
    for (let i = 0; i < locationList.length; i += 1) {
        if (locationList[i].postalCode) {
            let address = locationList[i].address ? `${locationList[i].address}, ` : "";
            address += `${locationList[i].postalCode} ${fixLocationName(locationList[i].city)}`;
            employerLocation.push(address);
        } else if (locationList[i].municipal) {
            employerLocation.push(`${fixLocationName(locationList[i].municipal)}`);
        } else if (locationList[i].country) {
            employerLocation.push(`${fixLocationName(locationList[i].country)}`);
        }
    }

    return employerLocation.join(", ");
}

function getEmployerData(adData: AdDTORAW): EmployerDTO {
    const employerData: EmployerDTO = {
        name: getEmployerName(adData),
        orgnr: getEmployerId(adData),
        sector: getString(adData.properties.sector),
        homepage: getUrl(adData.properties.employerhomepage), // change check in EmployerDetails.tsx
        linkedinPage: getUrl(adData.properties.linkedinpage), // change check in EmployerDetails.tsx
        twitterAddress: getUrl(adData.properties.twitteraddress), // change check in EmployerDetails.tsx
        facebookPage: getUrl(adData.properties.facebookpage), // change check in EmployerDetails.tsx
        description: DOMPurify.sanitize(adData.properties.employerdescription),
    };
    if (adData.employer && adData.employer.locationList) {
        const locationList = getLocationListData(adData.employer.locationList);
        employerData.locationList = locationList;
        if (locationList) {
            const location = getEmployerLocation(locationList);
            if (location) {
                employerData.location = location;
            }
        }
    }
    return removeUndefinedValues(employerData);
}

function isIsoString(value: unknown): value is string {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
}
export default function mapAdData(rawElasticSearchAdResult: ElasticSearchAdResult): MapedAdDTO | undefined {
    if (!rawElasticSearchAdResult || !rawElasticSearchAdResult._source) {
        return undefined;
    }
    const data = rawElasticSearchAdResult._source;

    if (!data) {
        return undefined;
    }
    const { properties } = data;
    if (!properties) {
        return undefined;
    }

    return {
        id: getString(rawElasticSearchAdResult._id),
        status: getString(data.status),
        title: getString(data.title),
        adText: getAdText(properties.adtext),
        published: getDate(data.published),
        expires: getDate(data.expires),
        updated: getDate(data.updated),
        source: getString(data.source),
        reference: getString(data.reference),
        medium: getString(data.medium),
        applicationDue: getString(properties.applicationdue),
        applicationEmail: getEmail(properties.applicationemail),
        applicationUrl: getUrl(properties.applicationurl),
        sourceUrl: getUrl(properties.sourceurl),
        hasSuperraskSoknad: getString(properties.hasInterestform),
        jobPostingFormat: getString(properties.adtextFormat),
        adNumber: getNumber(data.id),
        businessName: getString(data.businessName),

        // employment details
        engagementType: getString(properties.engagementtype),
        extent: getExtent(properties.extent),
        jobArrangement: getString(properties.jobarrangement),
        jobPercentage: getJobPercentage(properties.jobpercentage),
        jobPercentageRange: getJobPercentageRange(properties.jobpercentagerange),
        jobTitle: getString(properties.jobtitle),
        positionCount: getString(properties.positioncount),
        remote: getString(properties.remote),
        startTime: getString(properties.starttime),
        workdays: getWorktime(properties.workday),
        workHours: getWorktime(properties.workhours),
        workLanguages: getArray(properties.workLanguage),
        locationList: getLocationListData(data.locationList),
        location: getString(properties.location),

        // Employer
        employer: getEmployerData(data),
        contactList: getContactList(data.contactList),

        // For debugging
        categoryList: getArray(data.categoryList),
        searchtags: getArray(properties.searchtags),
        education: getArray(properties.education),
        experience: getArray(properties.experience),
        needDriversLicense: getArray(properties.needDriversLicense),
    };
}

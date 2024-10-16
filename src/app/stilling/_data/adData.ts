import { containsEmail, extractEmail, isValidEmail, mailtoInString } from "@/app/_common/utils/utils";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import logger from "@/app/_common/utils/logger";
import {
    AdDTORAW,
    ElasticSearchAdResult,
    EmployerDTO,
    Location,
    MappedAdDTO,
    UrlDTO,
} from "@/app/stilling/_data/types";

/**
 *  --------------------------- Common Functions ---------------------------
 */

export function getDate(date: unknown): Date | undefined {
    return isIsoString(date) ? new Date(date) : undefined;
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

function getExtent(extent: string | string[]): string | string[] | undefined {
    if (typeof extent === "string") {
        return extent;
    }

    if (Array.isArray(extent)) {
        return extent;
    }

    return undefined;
}

function addPercentageAtEnd(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    return value.endsWith("%") ? value : `${value}%`;
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

/**
 *  --------------------------- Employer Data ---------------------------
 */

function getEmployerName(adData: AdDTORAW): string | undefined {
    if (adData.properties.employer) {
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

function getEmployerId(adData: AdDTORAW): string | undefined {
    if (adData.employer) {
        return adData.employer.orgnr;
    }

    return undefined;
}

function getEmployerLocation(list: Location[]): string | undefined {
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

function getEmployerData(adData: AdDTORAW): EmployerDTO {
    const employerData: EmployerDTO = {
        name: getEmployerName(adData),
        orgnr: getEmployerId(adData),
        sector: adData.properties.sector,
        homepage: getUrl(adData.properties.employerhomepage), // change check in EmployerDetails.tsx
        linkedinPage: getUrl(adData.properties.linkedinpage), // change check in EmployerDetails.tsx
        twitterAddress: getUrl(adData.properties.twitteraddress), // change check in EmployerDetails.tsx
        facebookPage: getUrl(adData.properties.facebookpage), // change check in EmployerDetails.tsx
        description: DOMPurify.sanitize(adData.properties.employerdescription),
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

function isIsoString(value: unknown): value is string {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
}
export default function mapAdData(rawElasticSearchAdResult: ElasticSearchAdResult): MappedAdDTO | undefined {
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
        id: rawElasticSearchAdResult._id,
        status: data.status,
        title: data.title,

        source: data.source,
        reference: data.reference,
        medium: data.medium,
        applicationDue: properties.applicationdue,
        hasSuperraskSoknad: properties.hasInterestform,
        jobPostingFormat: properties.adtextFormat,
        adNumber: data.id,
        businessName: data.businessName,

        // employment details
        engagementType: properties.engagementtype,
        jobArrangement: properties.jobarrangement,
        jobTitle: properties.jobtitle,
        positionCount: properties.positioncount,
        remote: properties.remote,
        startTime: properties.starttime,
        locationList: data.locationList,
        location: properties.location,
        adText: getAdText(properties.adtext),
        published: getDate(data.published),
        expires: getDate(data.expires),
        updated: getDate(data.updated),
        applicationEmail: properties.applicationemail,
        applicationUrl: getUrl(properties.applicationurl),
        sourceUrl: getUrl(properties.sourceurl),
        extent: getExtent(properties.extent),
        jobPercentage: addPercentageAtEnd(properties.jobpercentage),
        jobPercentageRange: addPercentageAtEnd(properties.jobpercentagerange),
        workLanguages: properties.workLanguage,
        workdays: getWorktime(properties.workday),
        workHours: getWorktime(properties.workhours),

        // Employer
        employer: getEmployerData(data),
        contactList: data.contactList,

        // For debugging
        categoryList: data.categoryList,
        searchtags: properties.searchtags,
        education: properties.education,
        experience: properties.experience,
        needDriversLicense: properties.needDriversLicense,
    };
}

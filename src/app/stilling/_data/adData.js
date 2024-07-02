import { containsEmail, extractEmail, isValidEmail, mailtoInString } from "@/app/_common/utils/utils";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import logger from "@/app/_common/utils/logger";

/**
 *  --------------------------- Common Functions ---------------------------
 */
function getString(value) {
    if (value && typeof value === "string") {
        return value;
    }
    return undefined;
}

function getNumber(value) {
    if (value && typeof value === "number") {
        return value;
    }
    return undefined;
}

function getArray(arrayData) {
    return Array.isArray(arrayData) ? arrayData : undefined;
}

function getUrl(url) {
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

export function removeUndefinedValues(input) {
    const output = {};
    Object.keys(input).forEach((prop) => {
        const value = input[prop];
        if (value !== undefined) {
            output[prop] = value;
        }
    });

    return output;
}

function getLocationListData(value) {
    const locationList = getArray(value);
    if (!locationList) {
        return [];
    }
    return locationList.map((location) =>
        removeUndefinedValues({
            address: getString(location.address),
            city: getString(location.city),
            postalCode: getString(location.postalCode),
            municipal: getString(location.municipal),
            country: getString(location.country),
        }),
    );
}

function getEmail(email) {
    return isValidEmail(email) ? email : undefined;
}

function getExtent(extent) {
    let result = getString(extent);
    if (!result) {
        result = getArray(extent);
    }
    return result;
}

function getJobPercentage(value) {
    const jobPercentage = getString(value);
    if (!jobPercentage) {
        return undefined;
    }

    return jobPercentage + (jobPercentage.endsWith("%") ? "" : "%");
}

function getJobPercentageRange(value) {
    const jobPercentageRange = getString(value);
    if (!jobPercentageRange) {
        return undefined;
    }

    return jobPercentageRange + (jobPercentageRange.endsWith("%") ? "" : "%");
}

function getAdText(adText) {
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

export function getWorktime(worktime) {
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

function getContactList(value) {
    const contactList = getArray(value);
    if (!contactList) {
        return undefined;
    }

    return contactList.map((contact) =>
        removeUndefinedValues({
            name: getString(contact.name),
            title: getString(contact.title),
            phone: getString(contact.phone),
            email: getEmail(contact.email),
        }),
    );
}

/**
 *  --------------------------- Employer Data ---------------------------
 */

function getEmployerName(adData) {
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

function getEmployerId(adData) {
    if (adData.employer) {
        return getString(adData.employer.orgnr);
    }

    return undefined;
}

function getEmployerLocation(value) {
    const locationList = getArray(value);
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

function getEmployerData(adData) {
    const employerData = {
        name: getEmployerName(adData),
        orgnr: getEmployerId(adData),
        homepage: getUrl(adData.properties.employerhomepage), // change check in EmployerDetails.jsx
        linkedinPage: getUrl(adData.properties.linkedinpage), // change check in EmployerDetails.jsx
        twitterAddress: getUrl(adData.properties.twitteraddress), // change check in EmployerDetails.jsx
        facebookPage: getUrl(adData.properties.facebookpage), // change check in EmployerDetails.jsx
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

export default function mapAdData(rawElasticSearchAdResult) {
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

    return removeUndefinedValues({
        id: getString(rawElasticSearchAdResult._id),
        status: getString(data.status),
        title: getString(data.title),
        adText: getAdText(properties.adtext),
        published: getString(data.published),
        expires: getString(data.expires),
        updated: getString(data.updated),
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

        // employment details
        engagementType: getString(properties.engagementtype),
        extent: getExtent(properties.extent),
        jobArrangement: getString(properties.jobarrangement),
        jobPercentage: getJobPercentage(properties.jobpercentage),
        jobPercentageRange: getJobPercentageRange(properties.jobpercentagerange),
        jobTitle: getString(properties.jobtitle),
        positionCount: getString(properties.positioncount),
        remote: getString(properties.remote),
        sector: getString(properties.sector),
        startTime: getString(properties.starttime),
        workdays: getWorktime(properties.workday),
        workHours: getWorktime(properties.workhours),
        workLanguages: getArray(properties.workLanguage),
        locationList: getLocationListData(data.locationList),
        location: getString(properties.location),

        // Employer
        employer: getEmployerData(data),
        contactList: getContactList(data.contactList),
    });
}

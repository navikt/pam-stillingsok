import {
    containsEmail,
    extractEmail,
    isValidEmail,
    JobPostingTextEnum,
    mailtoInString,
} from "@/app/_common/utils/utils";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "@/app/_common/utils/fixLocationName";

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
        jobPostingFormat: getJobPostingFormat(properties.adText),

        // employment details
        engagementType: getString(properties.engagementType),
        extent: getString(properties.extent),
        jobArrangement: getString(properties.jobarrangement),
        jobPercentage: getJobPercentage(properties.jobpercentage),
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

function getEmail(email) {
    return isValidEmail(email) ? email : undefined;
}

function getJobPercentage(value) {
    const jobPercentage = getString(value);
    if (!jobPercentage) {
        return undefined;
    }

    return jobPercentage + jobPercentage.endsWith("%") ? "" : "  %";
}

function getWorktime(value) {
    const worktime = getString(value);
    if (!worktime) {
        return undefined;
    }

    // We need this check in case of old workhour/-day property values, formatted like 'Opt1 Opt2'
    const items = [];
    try {
        const jsonArray = JSON.parse(worktime);

        for (let i = 0; i < jsonArray.length; i += 1) {
            items.push(jsonArray[i]);
        }
    } catch (e) {
        items.push(worktime);
    }
    return items;
}

function getContactList(value) {
    const contactList = getArray(value);
    if (!contactList) {
        return undefined;
    }

    return removeUndefinedValues(
        contactList.map((contact) => ({
            name: getString(contact.name),
            title: getString(contact.title),
            phone: getString(contact.phone),
            email: getEmail(contact.email),
        })),
    );
}

/**
 *  --------------------------- Common Functions ---------------------------
 */
function getString(value) {
    if (value && typeof value === "string") {
        return value;
    }
    return undefined;
}

function getArray(arrayData) {
    return Array.isArray(arrayData) ? arrayData : undefined;
}

function getUrl(url) {
    try {
        const urlIsValid = new URL(url).protocol.startsWith("http");
        if (urlIsValid) {
            return url;
        } else {
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
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

function getJobPostingFormat(adText) {
    if (
        adText &&
        adText.includes('<section id="arb-serEtter">') &&
        adText.includes('<section id="arb-arbeidsoppgaver">') &&
        adText.includes('<section id="arb-tilbyr">')
    ) {
        return JobPostingTextEnum.STRUKTURERT;
    }
    return JobPostingTextEnum.IKKE_STRUKTURERT;
}

/**
 *  --------------------------- Employer Data ---------------------------
 */
function getEmployerData(adData) {
    const employerData = {
        name: getEmployerName(adData),
        homepage: getUrl(adData.properties.employerhomepage), //change check in EmployerDetails.jsx
        linkedinPage: getUrl(adData.properties.linkedinpage), //change check in EmployerDetails.jsx
        twitterAddress: getUrl(adData.properties.twitteraddress), //change check in EmployerDetails.jsx
        facebookPage: getUrl(adData.properties.facebookpage), //change check in EmployerDetails.jsx
        description: DOMPurify.sanitize(adData.properties.employerdescription),
    };
    if (adData.properties.employer && adData.properties.employer.locationList) {
        const locationList = getLocationListData(adData.properties.employer.locationList);
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

function getEmployerLocation(value) {
    const locationList = getArray(value);
    if (!locationList) {
        return undefined;
    }

    let employerLocation = [];
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

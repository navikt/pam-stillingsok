import { containsEmail, extractEmail, formatDate, isValidEmail, mailtoInString } from "@/app/_common/utils/utils";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { parseISO } from "date-fns";

/**
 *  --------------------------- Ad Data ---------------------------
 */
export default function mapAdData(queryData) {
    const data = queryData._source ? queryData._source : queryData ? queryData : undefined;
    if (!data) {
        return undefined;
    }
    const { properties } = data;
    if (!properties) {
        return undefined;
    }

    const adText = getAdText(properties.adtext);

    return {
        id: getString(queryData, "_id"),
        status: getString(data, "status"),
        title: getString(data, "title"),
        adText: getAdText(properties.adtext),
        published: getString(data, "published"),
        expires: getString(data, "expires"),
        updated: getDate(data, "updated"),
        source: getString(data, "source"),
        reference: getString(data, "reference"),
        medium: getString(data, "medium"),
        applicationDue: getString(properties, "applicationdue"),
        applicationEmail: getEmail(properties.applicationemail),
        applicationUrl: getUrl(properties.applicationurl),
        sourceUrl: getUrl(properties.sourceurl),
        hasSuperraskSoknad: getString(properties, "hasInterestform"),

        // employment details
        engagementType: getString(properties, "engagementType"),
        extent: getString(properties, "extent"),
        jobArrangement: getString(properties, "jobarrangement"),
        jobPercentage: getJobPercentage(properties.jobpercentage),
        jobTitle: getString(properties, "jobtitle"),
        positionCount: getString(properties, "positioncount"),
        remote: getString(properties, "remote"),
        sector: getString(properties, "sector"),
        startTime: getDate(properties, "starttime"),
        workday: getWorktime(properties.workday),
        workhours: getWorktime(properties.workhours),
        workLanguages: getArray(properties, "workLanguage"),
        locationList: getLocationListData(data.locationList),
        location: getString(properties, "location"),

        // Employer
        employer: getEmployerData(data),
        contactList: getContactList(data.contactList),
    };
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

function getJobPercentage(jobPercentage) {
    if (!jobPercentage) {
        return undefined;
    }

    return jobPercentage + jobPercentage.endsWith("%") ? "" : "  %";
}

function getWorktime(worktime) {
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
    return items.join(", ");
}

function getContactList(contactList) {
    if (!contactList) {
        return undefined;
    }

    return contactList.map((contact) => {
        return {
            ...contact,
            email: getEmail(contact.email),
        };
    });
}

/**
 *  --------------------------- Common Functions ---------------------------
 */
function getString(data, key) {
    const value = data[key];
    if (value && typeof value === "string") {
        return value;
    }
    return undefined;
}

function getDate(data, key) {
    const date = getString(data, key);
    return date ? formatDate(date) : undefined;
}

function getArray(data, key) {
    const arrayData = data[key];
    return Array.isArray(arrayData) ? arrayData : [];
}

function getUrl(url) {
    try {
        const urlIsValid = new URL(url).protocol.startsWith("http");
        if (urlIsValid) {
            return url;
        }
    } catch (e) {
        return undefined;
    }
}

function getLocationListData(locationList) {
    if (!locationList) {
        return [];
    }
    return locationList.map((location) => {
        return {
            address: location.address,
            city: location.city,
            postalCode: location.postalCode,
            municipal: location.municipal,
            country: location.country,
        };
    });
}

/**
 *  --------------------------- Employer Data ---------------------------
 */
function getEmployerData(adData) {
    const employerData = {
        name: getEmployerName(adData),
        homepage: getUrl(adData.properties.homepage), //change check in EmployerDetails.jsx
        linkedinPage: getUrl(adData.properties.linkedinpage), //change check in EmployerDetails.jsx
        twitterAddress: getUrl(adData.properties.twitteraddress), //change check in EmployerDetails.jsx
        facebookPage: getUrl(adData.properties.facebookpage), //change check in EmployerDetails.jsx
        description: DOMPurify.sanitize(adData.properties.employerdescription),
    };
    if (adData.properties.employer && adData.properties.employer.locationList) {
        const locationList = getLocationListData(adData.properties.employer.locationList);
        employerData["locationList"] = locationList;
        if (locationList) {
            const location = getEmployerLocation(locationList);
            if (location) {
                employerData["location"] = location;
            }
        }
    }
    return employerData;
}

function getEmployerName(adData) {
    if (adData && adData.properties && adData.properties.employer) {
        return adData.properties.employer;
    }
    if (adData && adData.businessName) {
        return adData.businessName;
    }
    if (adData && adData.employer) {
        return adData.employer.name;
    }

    return null;
}

function getEmployerLocation(locationList) {
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

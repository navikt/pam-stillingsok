"use server";

import AdData from "./AdData";
import { notFound } from "next/navigation";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";
import {
    containsEmail,
    extractEmail,
    formatDate,
    isValidEmail,
    isValidUrl,
    mailtoInString,
} from "@/app/_common/utils/utils";
import fixLocationName from "@/app/_common/utils/fixLocationName";

// Expose only necessary data to client
const sourceIncludes = [
    "businessName",
    "contactList.email",
    "contactList.name",
    "contactList.phone",
    "contactList.title",
    "employer.name",
    "employer.locationList.postalCode",
    "employer.locationList.city",
    "employer.locationList.address",
    "employer.locationList.municipal",
    "employer.locationList.country",
    "employer.location.city" /* todo finnes employer dataene lengre?*/,
    "employer.location.county" /* todo finnes employer dataene lengre?*/,
    "employer.location.country" /* todo finnes employer dataene lengre?*/,
    "expires",
    "id",
    "locationList.postalCode",
    "locationList.city",
    "locationList.address",
    "locationList.municipal",
    "locationList.county",
    "locationList.country",
    "medium",
    "properties.adtext",
    "properties.address",
    "properties.applicationdue",
    "properties.applicationemail",
    "properties.applicationurl",
    "properties.employer",
    "properties.employerdescription",
    "properties.employerhomepage",
    "properties.engagementtype",
    "properties.extent",
    "properties.facebookpage",
    "properties.hasInterestform",
    "properties.jobarrangement",
    "properties.jobpercentage",
    "properties.jobtitle",
    "properties.linkedinpage",
    "properties.location",
    "properties.positioncount",
    "properties.remote",
    "properties.sector",
    "properties.sourceurl",
    "properties.starttime",
    "properties.twitteraddress",
    "properties.workday",
    "properties.workhours",
    "properties.workLanguage",
    "published",
    "reference",
    "source",
    "status",
    "title",
    "updated",
].join(",");

function processAd(adText) {
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
    return parse(DOMPurify.sanitize(processedAdText));
}

function findEmployerName(adData) {
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

function getWorkLocation(propertyLocation, locationList, hidePostAddress = true) {
    if (propertyLocation) {
        return propertyLocation;
    }

    if (!locationList) {
        return "";
    }

    const workLocations = [];
    for (let i = 0; i < locationList.length; i += 1) {
        if (locationList[i].city && hidePostAddress) {
            workLocations.push(fixLocationName(locationList[i].city));
        } else if (locationList[i].postalCode) {
            let tmp = locationList[i].address ? `${locationList[i].address}, ` : "";
            tmp += `${locationList[i].postalCode} ${fixLocationName(locationList[i].city)}`;
            workLocations.push(tmp);
        } else if (locationList[i].municipal) {
            workLocations.push(fixLocationName(locationList[i].municipal));
        } else if (locationList[i].county) {
            workLocations.push(fixLocationName(locationList[i].county));
        } else if (locationList[i].country) {
            workLocations.push(fixLocationName(locationList[i].country));
        }
    }

    return workLocations.join(", ");
}

function getUrlData(url) {
    return {
        url,
        isValidUrl: isValidUrl(url),
    };
}

function getEmployerData(adData) {
    const employerData = {
        name: findEmployerName(adData),
        homepage: getUrlData(adData.properties.homepage), //change check in EmployerDetails.jsx
        linkedinPage: getUrlData(adData.properties.linkedinpage), //change check in EmployerDetails.jsx
        twitterAddress: getUrlData(adData.properties.twitteraddress), //change check in EmployerDetails.jsx
        facebookPage: getUrlData(adData.properties.facebookpage), //change check in EmployerDetails.jsx
        description: parse(DOMPurify.sanitize(adData.properties.employerdescription)),
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

function getJobPercentage(jobPercentage) {
    if (!jobPercentage) {
        return undefined;
    }

    return jobPercentage + jobPercentage.endsWith("%") ? "" : " %";
}

function getContactList(contactList) {
    if (!contactList) {
        return undefined;
    }

    return contactList.map((contact) => {
        return {
            ...contact,
            isValidEmail: isValidEmail(contact.email),
        };
    });
}

function getFormattedAdData(queryData) {
    const adData = queryData._source ? queryData._source : queryData ? queryData : undefined;
    if (!adData) {
        console.info("queryData is undefined: ", adData);
        return undefined;
    }
    const { properties } = adData;
    if (!properties) {
        console.info("queryData.properties is undefined: ", adData);
        return undefined;
    }

    const adText = processAd(properties.adtext);

    return {
        id: adData.id,
        status: adData.status,
        title: adData.title,
        adText,
        published: adData.published,
        reference: adData.reference,

        // employment details
        engagementType: properties.engagementType,
        extent: properties.extent,
        jobArrangement: properties.jobarrangement,
        jobPercentage: getJobPercentage(properties.jobpercentage),
        jobTitle: properties.jobtitle,
        positionCount: properties.positioncount,
        remote: properties.remote,
        sector: properties.sector,
        startTime: formatDate(properties.starttime),
        workday: properties.workday,
        workhours: properties.workhours,
        workLanguages: properties.workLanguage,
        locationList: getLocationListData(adData.locationList),
        location: properties.location, // TODO: getWorkLocation

        // Employer
        employer: getEmployerData(adData),
        contactList: getContactList(adData.contactList),
    };
}

export async function getAdData(id) {
    const res = await fetch(
        `${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_includes=${sourceIncludes}`,
        {
            headers: getDefaultHeaders(),
            next: { revalidate: 60 },
        },
    );

    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return getFormattedAdData(await res.json());
}

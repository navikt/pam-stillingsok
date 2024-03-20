import * as amplitude from "@amplitude/analytics-browser";
import { getSessionId } from "./session";
import { JobPostingTextEnum } from "../utils/utils";

const userProperties = new amplitude.Identify();

export function initAmplitude(amplitudeToken) {
    try {
        const amplitudeKey = window.location.href.includes("nav.no") ? amplitudeToken : "";
        if (!amplitudeKey) return false;

        amplitude.init(amplitudeKey, "test@test.no", {
            transport: "beacon",

            batchEvents: false,
            includeReferrer: true,
            includeUtm: true,
            saveEvents: false,

            serverUrl: `https://amplitude.nav.no/collect`,
            defaultTracking: {
                pageViews: true,
                sessions: true,
                formInteractions: true,
            },
            /** Need this for /collect-auto according to https://nav-it.slack.com/archives/CMK1SCBP1/p1669722646425599
             * but seems to work fine with /collect? Keeping it here just in case.
             IngestionMetadata: {
                sourceName: window.location.toString(),
            },
             */
        });
        return true;
    } catch (e) {
        return false;
    }
}

const enrichData = (data) => ({ ...data, navSessionId: getSessionId() });

const logAmplitudeEvent = (event, data) => {
    amplitude.track(event, enrichData(data));
};

export const logSearchFilterAdded = (data) => {
    amplitude.track("Søkefilter lagt til", enrichData(data));
};

export const logSearchFilterRemoved = (data) => {
    amplitude.track("Søkefilter fjernet", enrichData(data));
};

function getJobPostingFormat(jobPosting) {
    if (
        jobPosting &&
        jobPosting._source &&
        jobPosting._source.properties &&
        jobPosting._source.properties.adtext &&
        jobPosting._source.properties.adtext.includes('<section id="arb-serEtter">') &&
        jobPosting._source.properties.adtext.includes('<section id="arb-arbeidsoppgaver">') &&
        jobPosting._source.properties.adtext.includes('<section id="arb-tilbyr">')
    ) {
        return JobPostingTextEnum.STRUKTURERT;
    }
    return JobPostingTextEnum.IKKE_STRUKTURERT;
}

export function logStillingVisning(ad) {
    // Todo - tror employer.location er erstattet med employer.locationList
    const employerLocation = ad._source.employer ? ad._source.employer.location : null;
    let hasContactMail = false;
    let hasContactPhone = false;
    const contactList = ad._source.contactList ? ad._source.contactList : null;

    if (contactList) {
        contactList.forEach((contact) => {
            if (contact.email) hasContactMail = true;
            if (contact.phone) hasContactPhone = true;
        });
    }
    if (contactList !== null) {
        contactList.forEach((contact) => {
            if (contact.email) hasContactMail = true;
            if (contact.phone) hasContactPhone = true;
        });
    }

    logAmplitudeEvent("Stilling visning", {
        title: ad._source.title || "N/A",
        id: ad._id,
        businessName: ad._source.businessName || "N/A",
        country: employerLocation ? employerLocation.country : "N/A",
        county: employerLocation ? employerLocation.county : "N/A",
        city: employerLocation ? employerLocation.city : "N/A",
        employer: ad._source.employer ? ad._source.employer.name : "N/A",
        expires: ad._source.expires || "N/A",
        published: ad._source.published || "N/A",
        fetchedFromSource: ad._source.source || "N/A",
        hasSuperraskSoknad: ad._source.properties.hasInterestform || "N/A",
        hasApplicationUrl: !!ad._source.properties.applicationurl || !!ad._source.properties.sourceurl,
        hasApplicationEmail: !!ad._source.properties.applicationemail,
        hasContactInfoMail: hasContactMail,
        hasContactInfoPhone: hasContactPhone,
        jobPostingFormat: getJobPostingFormat(ad),
    });
}

function setUserProperties(property, value) {
    userProperties.set(property, value);
    amplitude.identify(userProperties);
}

export function setAuthenticatedStatus(isAuthenticated) {
    setUserProperties("is_authenticated", isAuthenticated);
    logAmplitudeEvent("auth status", { is_authenticated: isAuthenticated });
}

export default logAmplitudeEvent;

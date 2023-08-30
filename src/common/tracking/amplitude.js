import * as amplitude from "@amplitude/analytics-browser";
import getSessionId from "../../session";

const userProperties = new amplitude.Identify();

function getAmplitudeKey() {
    if (window.location.href.includes("nav.no")) return window.__AMPLITUDE_TOKEN__;
    return "";
}
export function initAmplitude() {
    try {
        const amplitudeKey = getAmplitudeKey();
        if (!amplitudeKey) return false;

        amplitude.init(amplitudeKey, undefined, {
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

const enrichData = (data) => {
    let enrichedData = { ...data, navSessionId: getSessionId() };

    try {
        const erMellom25og30 = sessionStorage.getItem("erMellom25og30");

        if (erMellom25og30 !== "undefined" && erMellom25og30 === "true") {
            enrichedData = { ...enrichedData, ageGroup: "25-30" };
        }
    } catch (e) {
        // ignore sessionStorage error
    }

    return enrichedData;
};

const logAmplitudeEvent = (event, data) => {
    amplitude.track(event, enrichData(data));
};

export function logStillingVisning(ad) {
    const employerLocation = ad._source.employer ? ad._source.employer.location : null;
    let hasContactMail = false;
    let hasContactPhone = false;
    const contactList = ad._source.contactList ? ad._source.contactList : null;
    contactList.forEach((contact) => {
        if (contact.email) hasContactMail = true;
        if (contact.phone) hasContactPhone = true;
    });

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
        hasApplicationUrl: !!ad._source.properties.applicationurl,
        hasApplicationEmail: !!ad._source.properties.applicationemail,
        hasContactInfoMail: hasContactMail,
        hasContactInfoPhone: hasContactPhone,
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

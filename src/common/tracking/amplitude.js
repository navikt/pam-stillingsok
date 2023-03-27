import amplitude from "amplitude-js";
import getSessionId from "../../session";

export function initAmplitude() {
    amplitude.getInstance();
    amplitude.init(window.__AMPLITUDE_TOKEN__, null, {
        apiEndpoint: "amplitude.nav.no/collect",
        batchEvents: false,
        includeReferrer: true,
        includeUtm: true,
        saveEvents: false,
        transport: "beacon"
    });
}

export const logAmplitudePageview = (additionalData) => {
    let data = {
        page: `${window.location.pathname}${window.location.search}`,
        title: document.title
    };

    if (additionalData) {
        data = {
            ...data,
            ...additionalData
        };
    }

    logAmplitudeEvent("Sidevisning", data);
};

export function logStillingVisning(ad) {
    const employerLocation = ad._source.employer ? ad._source.employer.location : null;

    logAmplitudeEvent("Stilling visning", {
        title: ad._source.title || "N/A",
        id: ad._id,
        businessName: ad._source.businessName || "N/A",
        country: employerLocation ? employerLocation.country : "N/A",
        county: employerLocation ? employerLocation.county : "N/A",
        city: employerLocation ? employerLocation.city : "N/A",
        employer: ad._source.employer ? ad._source.employer.name : "N/A",
        expires: ad._source.expires || "N/A",
        published: ad._source.published || "N/A"
    });
}

const enrichData = (data) => {
    const isAuthenticated = false;

    let enrichedData = { ...data, isAuthenticated, navSessionId: getSessionId() };

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
    amplitude.logEvent(event, enrichData(data));
};

export default logAmplitudeEvent;

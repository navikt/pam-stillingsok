import * as amplitude from "@amplitude/analytics-browser";
import { FilterEventData, formatFilterEventData } from "@/app/_common/monitoring/amplitudeHelpers";
import { getSessionId } from "./session";
import { MappedAdDTO } from "@/app/lib/stillingSoekSchema";
import { BaseEvent } from "@amplitude/analytics-types";

const userProperties = new amplitude.Identify();

export function initAmplitude(amplitudeToken: string | undefined) {
    try {
        const amplitudeKey = window.location.href.includes("nav.no") ? amplitudeToken : "";
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

const enrichData = (data: Record<string, unknown> | FilterEventData | undefined) => ({
    ...data,
    navSessionId: getSessionId(),
});

const logAmplitudeEvent = (event: string | BaseEvent, data?: Record<string, unknown> | FilterEventData | undefined) => {
    amplitude.track(event, enrichData(data));
};

export const logFilterChanged = (data: FilterEventData) => {
    const formattedData = formatFilterEventData(data);
    amplitude.track("Filter Changed", enrichData(formattedData));
};

export function logStillingVisning(adData: MappedAdDTO) {
    // Todo - tror employer.location er erstattet med employer.locationList
    const employerLocation = adData.employer && adData.employer.locationList ? adData.employer.locationList[0] : null;
    let hasContactMail = false;
    let hasContactPhone = false;
    const contactList = adData.contactList ? adData.contactList : null;

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
        title: adData.title || "N/A",
        id: adData.id,
        country: employerLocation ? employerLocation.country : "N/A",
        county: employerLocation ? employerLocation.county : "N/A",
        city: employerLocation ? employerLocation.city : "N/A",
        employer: adData.employer && adData.employer.name ? adData.employer.name : "N/A",
        expires: adData.expires || "N/A",
        published: adData.published || "N/A",
        fetchedFromSource: adData.source || "N/A",
        hasSuperraskSoknad: adData.hasSuperraskSoknad || "N/A",
        hasApplicationUrl: !!adData.applicationUrl || !!adData.sourceUrl,
        hasApplicationEmail: !!adData.applicationEmail,
        hasContactInfoMail: hasContactMail,
        hasContactInfoPhone: hasContactPhone,
        jobPostingFormat: adData.jobPostingFormat,
    });
}

function setUserProperties(property: string, value: amplitude.Types.ValidPropertyType) {
    userProperties.set(property, value);
    amplitude.identify(userProperties);
}

export function setAuthenticatedStatus(isAuthenticated: boolean) {
    setUserProperties("is_authenticated", isAuthenticated);
    logAmplitudeEvent("auth status", { is_authenticated: isAuthenticated });
}

export default logAmplitudeEvent;

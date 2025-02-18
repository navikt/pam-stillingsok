import Cookies from "js-cookie";

interface ConsentData {
    consent: {
        analytics: boolean;
        surveys: boolean;
    };
    userActionTaken: boolean;
    meta: {
        createdAt: string;
        updatedAt: string;
        version: number;
    };
}

function getDefaultConsent(): ConsentData {
    return {
        consent: {
            analytics: false,
            surveys: false,
        },
        userActionTaken: false,
        meta: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
        },
    };
}

export function getCurrentConsent(): ConsentData {
    const cookieData = Cookies.get("arbeidsplassen-consent");
    if (cookieData) {
        try {
            return JSON.parse(cookieData) as ConsentData;
        } catch (error) {
            console.error("Failed to parse cookie data", error);
        }
    }
    return getDefaultConsent();
}

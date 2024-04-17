"use server";

import { cookies } from "next/headers";
import logger from "@/app/_common/utils/logger";

const USER_PREFERENCES_COOKIE_NAME = "userPreferences";
const ALLOWED_PANELID_VALUES = [
    "publisert",
    "sted",
    "yrke",
    "extent",
    "sector",
    "engagementType",
    "education",
    "workLanguage",
    "hjemmekontor",
];
const ALLOWED_DISMISSED_PANELS = ["new-filters-survey"];
const COOKIE_OPTIONS = { secure: true, httpOnly: true };

export async function getUserPreferences() {
    if (!cookies().has(USER_PREFERENCES_COOKIE_NAME)) {
        return {};
    }
    const existingCookie = cookies().get(USER_PREFERENCES_COOKIE_NAME) || {};
    try {
        const parsedCookie = JSON.parse(existingCookie.value);
        const closedFilters = (parsedCookie.closedFilters || []).filter((it) => ALLOWED_PANELID_VALUES.includes(it));
        const dismissedPanels = (parsedCookie.dismissedPanels || []).filter((it) =>
            ALLOWED_DISMISSED_PANELS.includes(it),
        );
        return { closedFilters, dismissedPanels };
    } catch (e) {
        logger.info(`Kunne ikke parse '${USER_PREFERENCES_COOKIE_NAME}' cookie`);
        return {};
    }
}

export async function addClosedFilter(panelId) {
    if (!ALLOWED_PANELID_VALUES.includes(panelId)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie = await getUserPreferences();
    const closedFilters = new Set(existingCookie.closedFilters || []).add(panelId);
    const newCookieValue = { ...existingCookie, closedFilters: [...closedFilters] };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function removeClosedFilter(panelId) {
    const existingCookie = await getUserPreferences();
    const closedFilters = (existingCookie.closedFilters || []).filter((it) => it !== panelId);
    const newCookieValue = { ...existingCookie, closedFilters };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function dismissPanel(panelId) {
    if (!ALLOWED_DISMISSED_PANELS.includes(panelId)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie = await getUserPreferences();
    const dismissedPanels = new Set(existingCookie.dismissedPanels || []).add(panelId);
    const newCookieValue = { ...existingCookie, dismissedPanels: [...dismissedPanels] };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

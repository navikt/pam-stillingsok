"use server";

import { cookies } from "next/headers";
import logger from "@/app/_common/utils/logger";

const USER_PREFERENCES_COOKIE_NAME = "userPreferences";
const ALLOWED_PANELID_VALUES = [
    "publisert",
    "sted",
    "yrke",
    "extent",
    "experience",
    "sector",
    "engagementType",
    "education",
    "workLanguage",
    "hjemmekontor",
];
const ALLOWED_DISMISSED_PANELS = ["new-filters-survey"];
const ALLOWED_RESULTS_PER_PAGE = [25, 100];
const COOKIE_OPTIONS = { secure: true, httpOnly: true };

export async function getUserPreferences() {
    if (!cookies().has(USER_PREFERENCES_COOKIE_NAME)) {
        return {};
    }
    const existingCookie = cookies().get(USER_PREFERENCES_COOKIE_NAME) || {};
    try {
        const parsedCookie = JSON.parse(existingCookie.value);
        const openFilters = (parsedCookie.openFilters || []).filter((it) => ALLOWED_PANELID_VALUES.includes(it));
        const dismissedPanels = (parsedCookie.dismissedPanels || []).filter((it) =>
            ALLOWED_DISMISSED_PANELS.includes(it),
        );
        const resultsPerPage =
            parsedCookie.resultsPerPage && ALLOWED_RESULTS_PER_PAGE.includes(parsedCookie.resultsPerPage)
                ? parsedCookie.resultsPerPage
                : undefined;

        const publishedJobFilterOpen = parsedCookie.publishedJobFilterOpen === true;

        return { openFilters, dismissedPanels, resultsPerPage, publishedJobFilterOpen };
    } catch (e) {
        logger.info(`Kunne ikke parse '${USER_PREFERENCES_COOKIE_NAME}' cookie`);
        return {};
    }
}

export async function addOpenFilter(panelId) {
    if (!ALLOWED_PANELID_VALUES.includes(panelId)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie = await getUserPreferences();
    const openFilters = new Set(existingCookie.openFilters || []).add(panelId);
    const newCookieValue = { ...existingCookie, openFilters: [...openFilters] };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function removeOpenFilter(panelId) {
    const existingCookie = await getUserPreferences();
    const openFilters = (existingCookie.openFilters || []).filter((it) => it !== panelId);
    const newCookieValue = { ...existingCookie, openFilters };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function addPublishedJobFilterOpen() {
    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, publishedJobFilterOpen: true };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function removePublishedJobFilterOpen() {
    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, publishedJobFilterOpen: false };
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

export async function saveResultsPerPage(resultsPerPage) {
    if (!ALLOWED_RESULTS_PER_PAGE.includes(resultsPerPage)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, resultsPerPage };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

"use server";

import { cookies } from "next/headers";
import logger from "@/app/_common/utils/logger";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

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
const ALLOWED_DISMISSED_PANELS: string[] = ["new-filters-survey"];
const ALLOWED_RESULTS_PER_PAGE: number[] = [25, 100];
const COOKIE_OPTIONS: { secure: boolean; httpOnly: boolean } = { secure: true, httpOnly: true };

export interface UserPreferences {
    openFilters?: Array<string>;
    dismissedPanels?: Array<string>;
    resultsPerPage?: number;
    publishedJobFilterOpen?: boolean;
}

export async function getUserPreferences(): Promise<UserPreferences> {
    if (!cookies().has(USER_PREFERENCES_COOKIE_NAME)) {
        return {} as UserPreferences;
    }
    const existingCookie: RequestCookie = cookies().get(USER_PREFERENCES_COOKIE_NAME)!;
    try {
        const parsedCookie = JSON.parse(existingCookie.value) as UserPreferences;
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
        return {} as UserPreferences;
    }
}

export async function addOpenFilter(panelId: string): Promise<void> {
    if (!ALLOWED_PANELID_VALUES.includes(panelId)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie: UserPreferences = await getUserPreferences();
    const openFilters: Set<string> = new Set(existingCookie.openFilters || []).add(panelId);
    const newCookieValue = { ...existingCookie, openFilters: Array.from(openFilters) };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function removeOpenFilter(panelId: string): Promise<void> {
    const existingCookie = await getUserPreferences();
    const openFilters = (existingCookie.openFilters || []).filter((it) => it !== panelId);
    const newCookieValue = { ...existingCookie, openFilters };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function addPublishedJobFilterOpen(): Promise<void> {
    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, publishedJobFilterOpen: true };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function removePublishedJobFilterOpen(): Promise<void> {
    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, publishedJobFilterOpen: false };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function dismissPanel(panelId: string): Promise<void> {
    if (!ALLOWED_DISMISSED_PANELS.includes(panelId)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie: UserPreferences = await getUserPreferences();
    const dismissedPanels = new Set<string>(existingCookie.dismissedPanels || []).add(panelId);
    const newCookieValue = { ...existingCookie, dismissedPanels: Array.from(dismissedPanels) };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function saveResultsPerPage(resultsPerPage: number): Promise<void> {
    if (!ALLOWED_RESULTS_PER_PAGE.includes(resultsPerPage)) {
        // Trying to set an invalid value
        return;
    }
    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, resultsPerPage };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

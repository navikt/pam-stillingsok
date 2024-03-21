"use server";

import { cookies } from "next/headers";
import logger from "@/app/_common/utils/logger";

const USER_PREFERENCES_COOKIE_NAME = "userPreferences";
const ALLOWED_PANELID_VALUES = ["publisert", "sted", "yrke", "extent", "sector", "engagementType", "workLanguage"];
const COOKIE_OPTIONS = { secure: true, httpOnly: true };

export async function getUserPreferences() {
    if (!cookies().has(USER_PREFERENCES_COOKIE_NAME)) {
        return {};
    }
    const existingCookie = cookies().get(USER_PREFERENCES_COOKIE_NAME) || {};
    try {
        const parsedCookie = JSON.parse(existingCookie.value);
        const closedFilters = (parsedCookie.closedFilters || []).filter((it) => ALLOWED_PANELID_VALUES.includes(it));
        return { closedFilters };
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
    const newCookieValue = { closedFilters: [...closedFilters] };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function removeClosedFilter(panelId) {
    const existingCookie = await getUserPreferences();
    let closedFilters = (existingCookie.closedFilters || []).filter((it) => it !== panelId);
    const newCookieValue = { closedFilters: closedFilters };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

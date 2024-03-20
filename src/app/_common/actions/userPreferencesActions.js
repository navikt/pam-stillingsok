"use server";

import { cookies } from "next/headers";
import logger from "@/app/_common/utils/logger";

const USER_PREFERENCES_COOKIE_NAME = "userPreferences";

export async function getUserPreferences() {
    if (!cookies().has(USER_PREFERENCES_COOKIE_NAME)) {
        return {};
    }
    const existingCookie = cookies().get(USER_PREFERENCES_COOKIE_NAME) || {};

    let parsedCookie;
    try {
        parsedCookie = JSON.parse(existingCookie.value);
    } catch (e) {
        logger.info(`Kunne ikke parse '${USER_PREFERENCES_COOKIE_NAME}' cookie`);
        parsedCookie = {};
    }
    return parsedCookie;
}

export async function addClosedFilter(panelId) {
    const existingCookie = await getUserPreferences();
    const closedFilters = new Set(existingCookie.closedFilters || []).add(panelId);
    const newCookieValue = { ...existingCookie, closedFilters: [...closedFilters], httpOnly: true };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), { secure: true });
}

export async function removeClosedFilter(panelId) {
    const existingCookie = await getUserPreferences();
    let closedFilters = (existingCookie.closedFilters || []).filter((it) => it !== panelId);
    const newCookieValue = { ...existingCookie, closedFilters: closedFilters, httpOnly: true };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), { secure: true });
}

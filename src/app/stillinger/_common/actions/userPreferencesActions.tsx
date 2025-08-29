"use server";

import { cookies } from "next/headers";
import logger from "@/app/stillinger/_common/utils/logger";
import { SortByEnum } from "@/app/stillinger/_common/utils/utils";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const USER_PREFERENCES_COOKIE_NAME = "userPreferences";

const ALLOWED_DISTANCE_OR_LOCATION_VALUES = ["location", "distance"];
const ALLOWED_RESULTS_PER_PAGE: number[] = [25, 100];
const COOKIE_OPTIONS: { secure: boolean; httpOnly: boolean } = { secure: true, httpOnly: true };
const VALID_PREFERENCE_OPTION = {
    favouritesSortBy: SortByEnum,
};

export interface UserPreferences {
    resultsPerPage?: number;
    favouritesSortBy?: string;
    locationOrDistance?: string;
}

export async function getUserPreferences(): Promise<UserPreferences> {
    if (!cookies().has(USER_PREFERENCES_COOKIE_NAME)) {
        return {} as UserPreferences;
    }
    const existingCookie: RequestCookie = cookies().get(USER_PREFERENCES_COOKIE_NAME)!;
    try {
        const parsedCookie = JSON.parse(existingCookie.value) as UserPreferences;

        const resultsPerPage =
            parsedCookie.resultsPerPage && ALLOWED_RESULTS_PER_PAGE.includes(parsedCookie.resultsPerPage)
                ? parsedCookie.resultsPerPage
                : undefined;
        const favouritesSortPreference =
            parsedCookie.favouritesSortBy && SortByEnum.validate(parsedCookie.favouritesSortBy)
                ? parsedCookie.favouritesSortBy
                : undefined;

        const locationOrDistance =
            parsedCookie.locationOrDistance &&
            ALLOWED_DISTANCE_OR_LOCATION_VALUES.includes(parsedCookie.locationOrDistance)
                ? parsedCookie.locationOrDistance
                : undefined;

        return {
            resultsPerPage,
            favouritesSortBy: favouritesSortPreference,
            locationOrDistance,
        };
    } catch (e) {
        logger.info(`Kunne ikke parse '${USER_PREFERENCES_COOKIE_NAME}' cookie`);
        return {} as UserPreferences;
    }
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

export async function saveLocationOrDistance(locationOrDistance: string): Promise<void> {
    if (!ALLOWED_DISTANCE_OR_LOCATION_VALUES.includes(locationOrDistance)) {
        // Trying to set an invalid value
        return;
    }

    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, locationOrDistance };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

export async function setUserPreference(propertyName: string, value: string): Promise<void> {
    if (!(propertyName in VALID_PREFERENCE_OPTION)) {
        logger.warn(`Invalid cookie property name ${propertyName}`);
    }

    if (!SortByEnum.validate(value)) {
        logger.warn(`Invalid cookie property value ${value}`);
        return;
    }

    const existingCookie = await getUserPreferences();
    const newCookieValue = { ...existingCookie, [propertyName]: value };
    cookies().set(USER_PREFERENCES_COOKIE_NAME, JSON.stringify(newCookieValue), COOKIE_OPTIONS);
}

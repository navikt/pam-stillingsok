import { SOMMERJOBB_SEARCH_RESULT_SIZE, PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { SearchParams } from "next/dist/server/request/search-params";

const parsePositiveIntOrDefault = (value: string | undefined, fallback: number): number => {
    const parsed = Number.parseInt(value ?? "", 10);
    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }
    return fallback;
};

export const getPageNumber = (searchParams: SearchParams): number => {
    const raw = searchParams[PAGE_PARAM_NAME];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return parsePositiveIntOrDefault(value, 1);
};

export const calculateFrom = (page: number): number => {
    const from = SOMMERJOBB_SEARCH_RESULT_SIZE * (page - 1);
    if (from > 0) {
        return from;
    }
    return 0;
};

/**
 * Custom logic: gjør plass til banner.
 * - page === 2: size = 13 (i page.tsx)
 * - page > 2: from justeres -1 (men aldri under 0)
 */
export const adjustFromForBanner = (from: number, page: number): number => {
    if (page > 2) {
        return Math.max(0, from - 1);
    }
    return from;
};

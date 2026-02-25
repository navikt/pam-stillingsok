import { SearchParams } from "next/dist/server/request/search-params";
import { MULIGHETER_SEARCH_RESULT_SIZE, PAGE_PARAM_NAME } from "@/app/muligheter/(sok)/_utils/constants";

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
    const from = MULIGHETER_SEARCH_RESULT_SIZE * (page - 1);
    if (from > 0) {
        return from;
    }
    return 0;
};

"use client";
/**
 * Hvorfor denne refaktoreringen
 * QueryProvider mener jeg er unødvendig kompleks og skaper en del render
 * For meg kan det se ut som noe som henger igjen fra tidligere React Spa løsning
 * vi kan løse dette med hooks istedenfor.
 * Bruke serverkomponenter der det er mulig og URL som kilde til sannhet for søketilstand,
 * og hooks for å synkronisere URL med søketilstand der det er nødvendig.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type NavigationMode = "push" | "replace";

export type QueryActions = Readonly<{
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string, value?: string) => boolean;
    set: (key: string, value: string) => void;
    append: (key: string, value: string) => void;
    remove: (key: string, value?: string) => void;
    toString: () => string;
    urlSearchParams: URLSearchParams;
    reset: () => void;
    setPaginate: (paginate: boolean) => void;
    paginate: boolean;
}>;

export function sizeWorkaround(urlSearchParams: URLSearchParams): number {
    let result = 0;

    urlSearchParams.forEach(() => {
        result += 1;
    });

    return result;
}

function cloneSearchParams(searchParams: URLSearchParams): URLSearchParams {
    return new URLSearchParams(searchParams.toString());
}

function applyDefaultValues(previousUrlSearchParams: URLSearchParams, key: string): URLSearchParams {
    const nextSearchParams = cloneSearchParams(previousUrlSearchParams);

    if (key !== QueryNames.FROM) {
        nextSearchParams.delete(QueryNames.FROM);
    }

    if (nextSearchParams.has(QueryNames.URL_VERSION) && sizeWorkaround(nextSearchParams) === 1) {
        nextSearchParams.delete(QueryNames.URL_VERSION);
    } else if (!nextSearchParams.has(QueryNames.URL_VERSION) && sizeWorkaround(nextSearchParams) > 0) {
        nextSearchParams.set(QueryNames.URL_VERSION, `${CURRENT_VERSION}`);
    }

    return nextSearchParams;
}

function createUrl(pathname: string, searchParams: URLSearchParams): string {
    const search = searchParams.toString();

    if (search.length === 0) {
        return pathname;
    }

    return `${pathname}?${search}`;
}

export default function useQuery(): QueryActions {
    const router = useRouter();
    const pathname = usePathname();
    const readonlySearchParams = useSearchParams();

    const searchParamsString = readonlySearchParams.toString();

    const urlSearchParams = useMemo(() => {
        return new URLSearchParams(searchParamsString);
    }, [searchParamsString]);

    /**
     * Bruker ref for at setPaginate(true) etterfulgt av query.set(...)
     * i samme event-loop skal fungere likt som før.
     */
    const paginateRef = useRef(false);
    const [paginate, setPaginateState] = useState(false);

    const setPaginate = useCallback((nextPaginate: boolean): void => {
        paginateRef.current = nextPaginate;
        setPaginateState(nextPaginate);
    }, []);

    const consumeNavigationMode = useCallback((): NavigationMode => {
        const mode: NavigationMode = paginateRef.current ? "push" : "replace";

        paginateRef.current = false;
        setPaginateState(false);

        return mode;
    }, []);

    const navigate = useCallback(
        (nextSearchParams: URLSearchParams): void => {
            const nextUrl = createUrl(pathname, nextSearchParams);
            const mode = consumeNavigationMode();

            if (mode === "push") {
                router.push(nextUrl);
            } else {
                router.replace(nextUrl, { scroll: false });
            }
        },
        [consumeNavigationMode, pathname, router],
    );

    const updateSearchParams = useCallback(
        (key: string, updater: (draft: URLSearchParams) => void): void => {
            const nextSearchParams = cloneSearchParams(urlSearchParams);

            updater(nextSearchParams);

            navigate(applyDefaultValues(nextSearchParams, key));
        },
        [navigate, urlSearchParams],
    );

    const get = useCallback(
        (key: string): string | null => {
            return urlSearchParams.get(key);
        },
        [urlSearchParams],
    );

    const getAll = useCallback(
        (key: string): string[] => {
            return urlSearchParams.getAll(key);
        },
        [urlSearchParams],
    );

    const has = useCallback(
        (key: string, value?: string): boolean => {
            if (typeof value === "undefined") {
                return urlSearchParams.has(key);
            }

            return urlSearchParams.getAll(key).includes(value);
        },
        [urlSearchParams],
    );

    const set = useCallback(
        (key: string, value: string): void => {
            updateSearchParams(key, (draft) => {
                draft.set(key, value);
            });
        },
        [updateSearchParams],
    );

    const append = useCallback(
        (key: string, value: string): void => {
            updateSearchParams(key, (draft) => {
                draft.append(key, value);
            });
        },
        [updateSearchParams],
    );

    const remove = useCallback(
        (key: string, value?: string): void => {
            updateSearchParams(key, (draft) => {
                if (typeof value === "undefined") {
                    draft.delete(key);
                } else {
                    draft.delete(key, value);
                }
            });
        },
        [updateSearchParams],
    );

    const reset = useCallback((): void => {
        navigate(new URLSearchParams());
    }, [navigate]);

    const toString = useCallback((): string => {
        return urlSearchParams.toString();
    }, [urlSearchParams]);

    return useMemo(() => {
        return {
            get,
            getAll,
            has,
            set,
            append,
            remove,
            toString,
            urlSearchParams,
            reset,
            setPaginate,
            paginate,
        };
    }, [append, get, getAll, has, paginate, remove, reset, set, setPaginate, toString, urlSearchParams]);
}

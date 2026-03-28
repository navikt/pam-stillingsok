"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type NavigationMode = "push" | "replace";

type QueryUpdateOptions = Readonly<{
    changedKey: string;
    navigationMode?: NavigationMode;
}>;

export type QueryActions = Readonly<{
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string, value?: string) => boolean;
    set: (key: string, value: string) => void;
    append: (key: string, value: string) => void;
    remove: (key: string, value?: string) => void;
    update: (updater: (draft: URLSearchParams) => void, options: QueryUpdateOptions) => void;
    toString: () => string;
    urlSearchParams: URLSearchParams;
    reset: () => void;
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

    const navigate = useCallback(
        (nextSearchParams: URLSearchParams, navigationMode: NavigationMode): void => {
            const nextUrl = createUrl(pathname, nextSearchParams);

            if (navigationMode === "push") {
                router.push(nextUrl);
            } else {
                router.replace(nextUrl, { scroll: false });
            }
        },
        [pathname, router],
    );

    const update = useCallback(
        (updater: (draft: URLSearchParams) => void, options: QueryUpdateOptions): void => {
            const nextSearchParams = cloneSearchParams(urlSearchParams);

            updater(nextSearchParams);

            const normalizedSearchParams = applyDefaultValues(nextSearchParams, options.changedKey);

            navigate(normalizedSearchParams, options.navigationMode ?? "replace");
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
            update(
                (draft) => {
                    draft.set(key, value);
                },
                {
                    changedKey: key,
                },
            );
        },
        [update],
    );

    const append = useCallback(
        (key: string, value: string): void => {
            update(
                (draft) => {
                    draft.append(key, value);
                },
                {
                    changedKey: key,
                },
            );
        },
        [update],
    );

    const remove = useCallback(
        (key: string, value?: string): void => {
            update(
                (draft) => {
                    if (typeof value === "undefined") {
                        draft.delete(key);
                    } else {
                        draft.delete(key, value);
                    }
                },
                {
                    changedKey: key,
                },
            );
        },
        [update],
    );

    const reset = useCallback((): void => {
        navigate(new URLSearchParams(), "replace");
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
            update,
            toString,
            urlSearchParams,
            reset,
        };
    }, [append, get, getAll, has, remove, reset, set, toString, update, urlSearchParams]);
}

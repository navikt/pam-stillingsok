import React, { ReactElement, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";
import { FROM, URL_VERSION } from "@/app/(sok)/_components/searchParamNames";

export const SearchQueryContext: React.Context<SearchQueryActions> = React.createContext({} as SearchQueryActions);

export type SearchQueryActions = {
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string, value?: string) => boolean;
    set: (key: string, value: string) => void;
    append: (key: string, value: string) => void;
    remove: (key: string, value?: string) => void;
    toString: () => string;
    urlSearchParams: URLSearchParams;
    reset: () => void;
    size: number;
    setPaginate: (paginate: boolean) => void;
    paginate: boolean;
};

interface SearchQueryProviderProps {
    children: React.ReactNode;
}

export function SearchQueryProvider({ children }: SearchQueryProviderProps): ReactElement {
    const initialSearchParams = useSearchParams();
    const [urlSearchParams, setUrlSearchParams] = useState(new URLSearchParams(initialSearchParams.toString()));
    const [paginate, setPaginate] = useState(false);
    const [hasChangesIndex, setHasChangesIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setUrlSearchParams(new URLSearchParams(initialSearchParams.toString()));
    }, [initialSearchParams]);

    useEffect(() => {
        if (hasChangesIndex > 0) {
            logAmplitudeEvent("Stillinger - Utførte søk");

            if (paginate) {
                setPaginate(false);
                router.push(`/?${urlSearchParams.toString()}`);
            } else {
                router.replace(`/?${urlSearchParams.toString()}`, { scroll: false });
            }
        }
    }, [hasChangesIndex]);

    function syncUrl(): void {
        setHasChangesIndex((prevState) => prevState + 1);
    }

    function getAll(key: string): string[] {
        return urlSearchParams.getAll(key);
    }

    function get(key: string): string | null {
        return urlSearchParams.get(key);
    }

    function has(key: string, value?: string): boolean {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/55569 /
        return urlSearchParams.has(key, value);
    }

    function toString(): string {
        return urlSearchParams.toString();
    }

    function set(key: string, value: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous.toString());
            newUrlSearchParams.set(key, value);
            return setDefaultValues(newUrlSearchParams, key);
        });
        syncUrl();
    }

    function append(key: string, value: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous.toString());
            newUrlSearchParams.append(key, value);
            return setDefaultValues(newUrlSearchParams, key);
        });
        syncUrl();
    }

    function remove(key: string, value?: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous.toString());
            // @ts-expect-error https://github.com/microsoft/TypeScript/issues/55569
            newUrlSearchParams.delete(key, value);
            return setDefaultValues(newUrlSearchParams, key);
        });
        syncUrl();
    }

    function reset(): void {
        setUrlSearchParams(new URLSearchParams());
        syncUrl();
    }

    function setDefaultValues(previousUrlSearchParams: URLSearchParams, key: string): URLSearchParams {
        const newUrlSearchParams = new URLSearchParams(previousUrlSearchParams.toString());

        if (key !== FROM) {
            newUrlSearchParams.delete(FROM);
        }

        /*
        if (newUrlSearchParams.has(URL_VERSION) && newUrlSearchParams.size === 1) {
            newUrlSearchParams.delete(URL_VERSION);
        } else if (!newUrlSearchParams.has(URL_VERSION) && newUrlSearchParams.size > 0) {
            newUrlSearchParams.set(URL_VERSION, `${CURRENT_VERSION}`);
        }
         */
        newUrlSearchParams.set(URL_VERSION, `${CURRENT_VERSION}`);

        return newUrlSearchParams;
    }

    return (
        <SearchQueryContext.Provider
            // eslint-disable-next-line
            value={{
                get,
                getAll,
                has,
                set,
                remove,
                append,
                toString,
                urlSearchParams,
                reset,
                setPaginate,
                paginate,
                size: urlSearchParams.size,
            }}
        >
            {children}
        </SearchQueryContext.Provider>
    );
}

const useSearchQuery = (): SearchQueryActions => {
    const context = React.useContext(SearchQueryContext);
    return context;
};

export default useSearchQuery;

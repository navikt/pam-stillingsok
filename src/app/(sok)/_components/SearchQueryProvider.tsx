import React, { ReactElement, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { CURRENT_VERSION, VERSION_QUERY_PARAM } from "@/app/(sok)/_utils/searchParamsVersioning";
import { FROM, SIZE } from "@/app/(sok)/_components/searchParamNames";

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
    const [urlSearchParams, setUrlSearchParams] = useState(new URLSearchParams(initialSearchParams));
    const [paginate, setPaginate] = useState(false);
    const [numberOfChanges, setNumberOfChanges] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setUrlSearchParams(initialSearchParams);
    }, [initialSearchParams]);

    useEffect(() => {
        if (numberOfChanges > 0) {
            logAmplitudeEvent("Stillinger - Utførte søk");

            // Add version parameter to url if necessary
            const newUrlSearchParams = new URLSearchParams(urlSearchParams);
            if (newUrlSearchParams.has(VERSION_QUERY_PARAM) && newUrlSearchParams.size === 1) {
                newUrlSearchParams.delete(VERSION_QUERY_PARAM);
            } else if (!newUrlSearchParams.has(VERSION_QUERY_PARAM) && newUrlSearchParams.size > 0) {
                newUrlSearchParams.set(VERSION_QUERY_PARAM, `${CURRENT_VERSION}`);
            }

            if (paginate) {
                setPaginate(false);
                router.push(`/?${newUrlSearchParams.toString()}`);
            } else {
                router.replace(`/?${newUrlSearchParams.toString()}`, { scroll: false });
            }
        }
    }, [numberOfChanges]);

    function syncUrl(): void {
        setNumberOfChanges((prevState) => prevState + 1);
    }

    function getAll(key: string): string[] {
        return urlSearchParams.getAll(key);
    }

    function get(key: string): string | null {
        return urlSearchParams.get(key);
    }

    function has(key: string, value?: string): boolean {
        return urlSearchParams.has(key, value);
    }

    function toString(): string {
        return urlSearchParams.toString();
    }

    function set(key: string, value: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous);
            newUrlSearchParams.set(key, value);
            return resetFromAndSize(newUrlSearchParams, key);
        });
        syncUrl();
    }

    function append(key: string, value: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous);
            newUrlSearchParams.append(key, value);
            return resetFromAndSize(newUrlSearchParams, key);
        });
        syncUrl();
    }

    function remove(key: string, value?: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous);
            newUrlSearchParams.delete(key, value);
            return resetFromAndSize(newUrlSearchParams, key);
        });
        syncUrl();
    }

    function reset(): void {
        setUrlSearchParams(new URLSearchParams());
        syncUrl();
    }

    function resetFromAndSize(previousUrlSearchParams: URLSearchParams, key: string): URLSearchParams {
        if (key === FROM || key === SIZE) {
            return previousUrlSearchParams;
        }
        const newUrlSearchParams = new URLSearchParams(previousUrlSearchParams);
        newUrlSearchParams.delete(FROM);
        newUrlSearchParams.delete(SIZE);
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

import React, { ReactElement, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { CURRENT_VERSION, VERSION_QUERY_PARAM } from "@/app/(sok)/_utils/searchParamsVersioning";

export const SearchStateContext: React.Context<SearchStateActions> = React.createContext({} as SearchStateActions);

export type SearchStateActions = {
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

interface SearchStateProviderProps {
    children: React.ReactNode;
}

export function SearchStateProvider({ children }: SearchStateProviderProps): ReactElement {
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
            if (paginate) {
                setPaginate(false);
                router.push(`/?${urlSearchParams.toString()}`);
            } else {
                router.replace(`/?${urlSearchParams.toString()}`, { scroll: false });
            }
        }
    }, [numberOfChanges]);

    function syncUrl(): void {
        setNumberOfChanges((prevState) => prevState + 1);

        // Add version parameter to url if necessary
        const newUrlSearchParams = new URLSearchParams(urlSearchParams);
        if (newUrlSearchParams.has(VERSION_QUERY_PARAM) && newUrlSearchParams.size === 1) {
            newUrlSearchParams.delete(VERSION_QUERY_PARAM);
        } else if (!newUrlSearchParams.has(VERSION_QUERY_PARAM) && newUrlSearchParams.size > 0) {
            newUrlSearchParams.set(VERSION_QUERY_PARAM, `${CURRENT_VERSION}`);
        }
        setUrlSearchParams(newUrlSearchParams);
    }

    function getAll(key: string): string[] {
        return urlSearchParams.getAll(key);
    }

    function get(key: string): string | null {
        return urlSearchParams.get(key);
    }

    function has(key: string, value?: string): boolean {
        // @ts-expect-error URLSearchParam supports value
        return urlSearchParams.has(key, value);
    }

    function toString(): string {
        return urlSearchParams.toString();
    }

    function set(key: string, value: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous);
            newUrlSearchParams.set(key, value);
            return newUrlSearchParams;
        });
        syncUrl();
    }

    function append(key: string, value: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous);
            newUrlSearchParams.append(key, value);
            return newUrlSearchParams;
        });
        syncUrl();
    }

    function remove(key: string, value?: string): void {
        setUrlSearchParams((previous) => {
            const newUrlSearchParams = new URLSearchParams(previous);
            // @ts-expect-error  URLSearchParam supports value
            newUrlSearchParams.delete(key, value);
            return newUrlSearchParams;
        });
        syncUrl();
    }

    function reset(): void {
        setUrlSearchParams(new URLSearchParams());
        syncUrl();
    }

    return (
        <SearchStateContext.Provider
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
        </SearchStateContext.Provider>
    );
}

const useSearchQuery = (): SearchStateActions => {
    const context = React.useContext(SearchStateContext);
    return context;
};

export default useSearchQuery;

import React, { ReactElement, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

export const QueryContext: React.Context<QueryActions> = React.createContext({} as QueryActions);

export type QueryActions = {
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
};

interface QueryProviderProps {
    children: React.ReactNode;
}

export function sizeWorkaround(urlSearchParams: URLSearchParams): number {
    let result: number = 0;
    urlSearchParams.forEach(() => {
        result += 1;
    });
    return result;
}

export function QueryProvider({ children }: QueryProviderProps): ReactElement {
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

        if (key !== QueryNames.FROM) {
            newUrlSearchParams.delete(QueryNames.FROM);
        }

        if (newUrlSearchParams.has(QueryNames.URL_VERSION) && sizeWorkaround(newUrlSearchParams) === 1) {
            newUrlSearchParams.delete(QueryNames.URL_VERSION);
        } else if (!newUrlSearchParams.has(QueryNames.URL_VERSION) && sizeWorkaround(newUrlSearchParams) > 0) {
            newUrlSearchParams.set(QueryNames.URL_VERSION, `${CURRENT_VERSION}`);
        }

        return newUrlSearchParams;
    }

    return (
        <QueryContext.Provider
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
            }}
        >
            {children}
        </QueryContext.Provider>
    );
}

const useQuery = (): QueryActions => {
    const context = React.useContext(QueryContext);
    return context;
};

export default useQuery;

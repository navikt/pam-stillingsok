import React, { ReactElement, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const IsDebugContext: React.Context<IsDebugContextValues> = React.createContext({} as IsDebugContextValues);

export type IsDebugContextValues = {
    isDebug: boolean;
};

interface IsDebugProviderProps {
    children: React.ReactNode;
}

export function IsDebugProvider({ children }: IsDebugProviderProps): ReactElement {
    const searchParams = useSearchParams();
    const explainParamDebug = searchParams.get("explain") === "true";

    const [localStorageDebug, setLocalStorageDebug] = useState(false);

    useEffect(() => {
        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setLocalStorageDebug(true);
            }
        } catch {
            // ignore
        }
    }, []);

    const isDebug = localStorageDebug || explainParamDebug;

    return (
        <IsDebugContext.Provider
            value={{
                isDebug,
            }}
        >
            {children}
        </IsDebugContext.Provider>
    );
}

const useIsDebug = (): IsDebugContextValues => {
    const context = React.useContext(IsDebugContext);
    return context;
};

export default useIsDebug;

import React, { ReactElement, useEffect, useState } from "react";

export const IsDebugContext: React.Context<IsDebugContextValues> = React.createContext({} as IsDebugContextValues);

export type IsDebugContextValues = {
    isDebug: boolean;
};

interface IsDebugProviderProps {
    children: React.ReactNode;
}

export function IsDebugProvider({ children }: IsDebugProviderProps): ReactElement {
    const [isDebug, setIsDebug] = useState(false);

    useEffect(() => {
        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setIsDebug(true);
            }
        } catch (err) {
            // ignore
        }
    }, []);

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

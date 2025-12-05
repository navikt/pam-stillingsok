import { useEffect, useState } from "react";
import React from "react";

export const PersonaliaContext = React.createContext({});

// TODO: Konverter til TSX og fjern eslint-disable når props er typesikret i TypeScript.
// eslint-disable-next-line react/prop-types
const PersonaliaProvider = ({ children }) => {
    const [personalia, setPersonalia] = useState({
        status: "not-fetched",
    });

    useEffect(() => {
        async function fetchPersonalia() {
            setPersonalia((prevState) => ({
                ...prevState,
                status: "pending",
            }));
            const response = await fetch("/min-side/api/aduser/api/v1/personalia", {
                credentials: "same-origin",
            });
            if (response.status === 200) {
                const json = await response.json();
                setPersonalia((prevState) => ({
                    ...prevState,
                    status: "success",
                    data: json,
                }));
            } else {
                setPersonalia((prevState) => ({
                    ...prevState,
                    status: "error",
                }));
            }
        }
        fetchPersonalia();
    }, []);

    return <PersonaliaContext.Provider value={personalia}>{children}</PersonaliaContext.Provider>;
};

export default PersonaliaProvider;

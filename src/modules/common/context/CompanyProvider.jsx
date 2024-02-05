import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import getCookie from "../utils/getCookie";
import { AuthenticationContext, AuthenticationStatus } from "../auth/contexts/AuthenticationProvider";

export const CompanyContext = React.createContext({});

function CompanyProvider({ children }) {
    const { authenticationStatus } = useContext(AuthenticationContext);

    const [organizationNumber, setOrganizationNumber] = useState();

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            const found = getCookie("organizationNumber");
            if (found) {
                setOrganizationNumber(found);
            }
        }
    }, [authenticationStatus]);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <CompanyContext.Provider value={{ organizationNumber }}>{children}</CompanyContext.Provider>
    );
}

CompanyProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default CompanyProvider;

import React from "react";
import PropTypes from "prop-types";
import { Alert as AkselAlert } from "@navikt/ds-react";

function Alert({ children }) {
    return (
        <AkselAlert variant="error" className="mb-1 mt-1" role="alert">
            {children}
        </AkselAlert>
    );
}

Alert.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Alert;

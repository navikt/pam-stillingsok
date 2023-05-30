import React from "react";
import { Alert as AkselAlert } from "@navikt/ds-react";

function Alert({ children }) {
    return (
        <AkselAlert variant="error" className="mb-1 mt-1" role="alert">
            {children}
        </AkselAlert>
    );
}

export default Alert;

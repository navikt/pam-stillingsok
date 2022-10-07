import React from "react";
import { Button as NavButton } from "@navikt/ds-react";
import "./Button.css";

function Button(props) {
    const { children, ...rest } = props;
    return (
        <NavButton {...rest} className="Button">
            {children}
        </NavButton>
    );
}

export default Button;

import React from "react";
import IconButton from "./IconButton";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
function RefreshButton(props) {
    return (
        <IconButton text={props.text || "Last på ny"} icon={<ArrowsCirclepathIcon aria-hidden="true" />} {...props} />
    );
}

export default RefreshButton;

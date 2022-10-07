import React from "react";
import IconButton from "./IconButton";
import RefreshIcon from "../Icon/RefreshIcon";

function RefreshButton(props) {
    return <IconButton text={props.text || "Last på ny"} icon={<RefreshIcon />} {...props} />;
}

export default RefreshButton;

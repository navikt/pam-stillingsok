import React from "react";
import PropTypes from "prop-types";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import IconButton from "./IconButton";

function RefreshButton({ text, ...props }) {
    return <IconButton text={text || "Last på ny"} icon={<ArrowsCirclepathIcon aria-hidden="true" />} {...props} />;
}

RefreshButton.propTypes = {
    text: PropTypes.string,
};

export default RefreshButton;

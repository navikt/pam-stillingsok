import React from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import PrintIcon from "../Icon/PrintIcon";

export default function PrintButton(props) {
    return <IconButton text="Skriv ut" icon={<PrintIcon />} {...props} />;
}

PrintButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

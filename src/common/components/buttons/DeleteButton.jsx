import React from "react";
import PropTypes from "prop-types";
import { TrashIcon } from "@navikt/aksel-icons";
import IconButton from "./IconButton";

function DeleteButton({ text, ...props }) {
    return <IconButton text={text || "Slett"} icon={<TrashIcon aria-hidden="true" />} {...props} />;
}

DeleteButton.propTypes = {
    text: PropTypes.string,
};

export default DeleteButton;

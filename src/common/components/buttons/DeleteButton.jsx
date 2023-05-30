import React from "react";
import { TrashIcon } from "@navikt/aksel-icons";
import IconButton from "./IconButton";

function DeleteButton({ text, ...props }) {
    return <IconButton text={text ? text : "Slett"} icon={<TrashIcon aria-hidden="true" />} {...props} />;
}

export default DeleteButton;

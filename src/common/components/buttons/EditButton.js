import React from "react";
import IconButton from "./IconButton";
import { PencilIcon } from "@navikt/aksel-icons";

function EditButton(props) {
    return <IconButton text="Endre" icon={<PencilIcon aria-hidden="true" />} {...props} />;
}

export default EditButton;

import React from "react";
import { PencilIcon } from "@navikt/aksel-icons";
import IconButton from "./IconButton";

function EditButton(props) {
    return <IconButton text="Endre" icon={<PencilIcon aria-hidden="true" />} {...props} />;
}

export default EditButton;

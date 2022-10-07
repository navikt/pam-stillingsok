import React from "react";
import IconButton from "./IconButton";
import EditIcon from "../Icon/EditIcon";

function EditButton(props) {
    return <IconButton text="Endre" icon={<EditIcon />} {...props} />;
}

export default EditButton;

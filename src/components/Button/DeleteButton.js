import React from "react";
import DeleteIcon from "../Icon/DeleteIcon";
import IconButton from "./IconButton";

function DeleteButton({ text, ...props }) {
    return <IconButton text={text ? text : "Slett"} icon={<DeleteIcon />} {...props} />;
}

export default DeleteButton;

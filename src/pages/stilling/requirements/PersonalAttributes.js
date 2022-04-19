import React from "react";
import ListBox from "./ListBox";
import { arrayHasData } from "./utils";

export default function PersonalAttributes({ stilling }) {
    if (arrayHasData(stilling._source.properties.personalattributes)) {
        return <ListBox title="Personlige egenskaper" items={stilling._source.properties.personalattributes} />;
    }
    return null;
}

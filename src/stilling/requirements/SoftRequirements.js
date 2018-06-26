import React from 'react';
import ListBox from './ListBox';
import { arrayHasData } from './utils';

export default function SoftRequirements({ stilling }) {
    if (arrayHasData(stilling._source.properties.softrequirements)) {
        return (
            <ListBox
                title="Ønsket kompetanse"
                items={stilling._source.properties.softrequirements}
            />
        );
    }
    return null;
}

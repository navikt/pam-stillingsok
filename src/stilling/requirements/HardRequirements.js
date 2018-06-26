import React from 'react';
import ListBox from './ListBox';
import { arrayHasData } from './utils';

export default function HardRequirements({ stilling }) {
    if (arrayHasData(stilling._source.properties.hardrequirements)) {
        return (
            <ListBox
                title="Krav (kvalifikasjoner)"
                items={stilling._source.properties.hardrequirements}
            />
        );
    }
    return null;
}

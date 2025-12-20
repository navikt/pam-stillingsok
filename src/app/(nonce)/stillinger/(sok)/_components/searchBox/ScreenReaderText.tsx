import React, { useEffect, useRef, useState } from "react";
import { BodyShort } from "@navikt/ds-react";
import { ComboboxOption } from "@navikt/ds-react/cjs/form/combobox/types";
import { buildSelectedOptions } from "@/app/(nonce)/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import useQuery from "@/app/(nonce)/stillinger/(sok)/_components/QueryProvider";

interface ScreenReaderTextProps {
    selectedOptions: ComboboxOption[];
}

const ScreenReaderText = ({ selectedOptions }: ScreenReaderTextProps) => {
    const query = useQuery();
    const [screenReaderText, setScreenReaderText] = useState("");

    const prevSelectedOptionsRef = useRef<ComboboxOption[]>(buildSelectedOptions(query.urlSearchParams));

    useEffect(() => {
        const prevSelectedOptions = prevSelectedOptionsRef.current;

        if (prevSelectedOptions.length !== selectedOptions.length) {
            if (selectedOptions.length > prevSelectedOptions.length) {
                setScreenReaderText(`${selectedOptions[selectedOptions.length - 1].label} ble lagt til søkefilteret.`);
            }

            if (selectedOptions.length < prevSelectedOptions.length) {
                setScreenReaderText(
                    `${prevSelectedOptions[prevSelectedOptions.length - 1].label} ble fjernet fra søkefilteret.`,
                );
            }
        }

        prevSelectedOptionsRef.current = selectedOptions;
    }, [selectedOptions]);

    return (
        <BodyShort as="span" aria-live="polite" role="alert" visuallyHidden>
            {screenReaderText}
        </BodyShort>
    );
};

export default ScreenReaderText;

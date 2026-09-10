import { BodyShort } from "@navikt/ds-react";
import type { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { useEffect, useRef, useState } from "react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { buildSelectedOptions } from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";

type SearchFilterAnnouncementProps = Readonly<{
    selectedOptions: readonly ComboboxOption[];
}>;

function SearchFilterAnnouncement({ selectedOptions }: SearchFilterAnnouncementProps) {
    const query = useQuery();
    const [screenReaderText, setScreenReaderText] = useState("");

    const prevSelectedOptionsRef = useRef<readonly ComboboxOption[]>(buildSelectedOptions(query.urlSearchParams));

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
}

export default SearchFilterAnnouncement;

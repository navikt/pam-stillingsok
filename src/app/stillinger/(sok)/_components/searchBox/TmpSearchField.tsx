"use client";
import { Search } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { type SubmitEventHandler, useEffect, useState } from "react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { markSearchBoxUsed } from "@/app/stillinger/(sok)/_components/searchExperienceRating/searchBoxUsed";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

export default function TmpSearchField() {
    const query = useQuery();
    const params = useSearchParams();
    const [value, setValue] = useState(params.getAll(QueryNames.SEARCH_STRING).join(" "));

    useEffect(() => {
        setValue(params.getAll(QueryNames.SEARCH_STRING).join(" "));
    }, [params]);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        markSearchBoxUsed();

        const trimmedValue = value.trim();

        if (trimmedValue) {
            query.update(
                (draft) => {
                    draft.set(QueryNames.SEARCH_STRING, trimmedValue);
                },
                {
                    changedKey: QueryNames.SEARCH_STRING,
                },
            );
        } else {
            query.update(
                (draft) => {
                    draft.delete(QueryNames.SEARCH_STRING);
                },
                {
                    changedKey: QueryNames.SEARCH_STRING,
                },
            );
        }
    };

    function onClear() {
        setValue("");
        query.update(
            (draft) => {
                draft.delete(QueryNames.SEARCH_STRING);
            },
            {
                changedKey: QueryNames.SEARCH_STRING,
            },
        );
    }

    return (
        <form onSubmit={onSubmit}>
            <Search variant="secondary" onClear={onClear} value={value} onChange={setValue} label="Søk etter jobber" />
        </form>
    );
}

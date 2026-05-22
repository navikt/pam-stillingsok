"use client";
import { Search } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { type SubmitEventHandler, useState } from "react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

export default function TmpSearchField() {
    const query = useQuery();
    const params = useSearchParams();
    const [value, setValue] = useState(params.getAll("q").join(" "));

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        if (value) {
            query.update(
                (draft) => {
                    draft.set(QueryNames.SEARCH_STRING, value);
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
            <Search
                variant="secondary"
                onClear={onClear}
                name="q"
                value={value}
                onChange={setValue}
                label="Søk etter jobber"
            />
        </form>
    );
}

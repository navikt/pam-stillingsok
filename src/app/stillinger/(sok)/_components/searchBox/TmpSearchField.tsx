"use client";
import { Search } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { type SubmitEventHandler, useEffect, useState } from "react";
import { containsEmail, containsValidFnrOrDnr } from "@/app/stillinger/_common/utils/utils";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { markSearchBoxUsed } from "@/app/stillinger/(sok)/_components/searchExperienceRating/searchBoxUsed";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

export default function TmpSearchField() {
    const query = useQuery();
    const params = useSearchParams();
    const [value, setValue] = useState(params.getAll(QueryNames.SEARCH_STRING).join(" "));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setValue(params.getAll(QueryNames.SEARCH_STRING).join(" "));
    }, [params]);

    const isValidFreeText = (value: string): boolean => {
        if (containsValidFnrOrDnr(value) || containsEmail(value)) {
            setErrorMessage(
                "Teksten du har skrevet inn kan inneholde personopplysninger. Dette er ikke tillatt av personvernhensyn. Hvis du mener dette er feil, kontakt oss på nav.team.arbeidsplassen@nav.no",
            );
            return false;
        }

        if (value.length > 100) {
            setErrorMessage("Søkeord kan ikke ha mer enn 100 tegn");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        markSearchBoxUsed();

        const trimmedValue = value.trim();

        if (isValidFreeText(trimmedValue)) {
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
        }
    };

    function onClear() {
        setValue("");
        setErrorMessage("");
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
                clearButton={false}
                variant="secondary"
                error={errorMessage}
                onClear={onClear}
                value={value}
                onChange={setValue}
                label="Søk etter jobber"
            />
        </form>
    );
}

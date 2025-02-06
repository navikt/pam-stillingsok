"use client";

import { TextField } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

function SearchAi() {
    // eslint-disable-next-line
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const query = useQuery();
    const inputQuery = query.get("q") || "";

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // eslint-disable-next-line
    const submitForm = (e: any) => {
        e.preventDefault();
        query.remove(QueryNames.SEARCH_STRING);
        query.append(QueryNames.SEARCH_STRING, searchTerm);
    };

    return (
        <>
            <form onSubmit={submitForm}>
                <TextField
                    defaultValue={inputQuery}
                    label="(a)I robot"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                />
            </form>
        </>
    );
}

export default SearchAi;

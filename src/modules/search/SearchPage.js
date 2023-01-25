import React from "react";
import Search from "./components/Search";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useTrackPageview from "../../common/hooks/useTrackPageview";
import { CONTEXT_PATH } from "../../common/environment";

function SearchPage() {
    useDocumentTitle("Ledige stillinger");
    useTrackPageview(CONTEXT_PATH, "Ledige stillinger");

    return <Search />;
}

export default SearchPage;

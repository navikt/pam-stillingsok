import React from "react";
import Search from "./components/Search";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

function SearchPage() {
    useDocumentTitle("Ledige stillinger");
    return <Search />;
}

export default SearchPage;

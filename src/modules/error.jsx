import React from "react";
import useDocumentTitle from "./common/hooks/useDocumentTitle";
import ErrorPage from "./common/components/errorPage/ErrorPage";

export default function Error() {
    useDocumentTitle("Feil");

    return <ErrorPage />;
}

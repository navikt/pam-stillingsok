import React from "react";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import ReportAd from "./components/ReportAd";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

function ReportAdPage() {
    useDocumentTitle("Rapportér annonse");
    useScrollToTop();

    return <ReportAd />;
}

export default ReportAdPage;

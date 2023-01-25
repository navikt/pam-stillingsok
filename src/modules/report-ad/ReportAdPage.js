import React from "react";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import Ad from "../ad/components/Ad";
import ReportAd from "./components/ReportAd";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

function ReportAdPage() {
    useDocumentTitle("Rapportér annonse");
    useScrollToTop();

    return <ReportAd />;
}

export default ReportAdPage;

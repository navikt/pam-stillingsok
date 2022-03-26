import * as React from "react";
import './AdStatisticsLink.less';
import logAmplitudeEvent from "../../amplitudeTracker";

const AD_STATISTICS_URL = 'https://data.nav.no/datapakke/703bc2e74c271ee895609ebd93c52460';

const AdStatisticsLink = () => {

    const logAmplitudeEventAndRedirect = (event) => {
        event.preventDefault();
        logAmplitudeEvent("Clicked Link", {
            label: "Viewed competition statistics"
        });
        window.open(AD_STATISTICS_URL, "_blank")
    };

    return (<a
        href={AD_STATISTICS_URL}
        className="AdStatisticsLink"
        target="_blank"
        onClick={logAmplitudeEventAndRedirect}
    >
        <div className="AdStatisticsLink-inner">
            <span className="AdStatisticsLink__text">Se vår oversikt over arbeidsmarkedet</span>
            <span className="Header__Lenkeikon"/>
        </div>
    </a>);
}

export default AdStatisticsLink;

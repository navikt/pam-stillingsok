import * as React from "react";
import './AdStatisticsLink.less';
import logAmplitudeEvent from "../../amplitudeTracker";

const AD_STATISTICS_URL = 'https://data.adeo.no/datapakke/8bad56547ac4f91eaf0d697f2f965351';

const AdStatisticsLink = () => (
    <a
        href={AD_STATISTICS_URL}
        className="AdStatisticsLink"
        target="_blank"
        onClick={logAmplitudeEvent('Viewed Ad Statistics')}
    >
        <div className="AdStatisticsLink-inner">
            <span className="AdStatisticsLink__text">Se status for jobbmarkedet</span>
            <span className="Header__Lenkeikon"/>
        </div>
    </a>
);

export default AdStatisticsLink;
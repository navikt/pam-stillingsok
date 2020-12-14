import * as React from "react";
import './AdStatisticsLink.less';

const AD_STATISTICS_URL = '';

const AdStatisticsLink = () => (
    <a
        href={AD_STATISTICS_URL}
        className="AdStatisticsLink"
    >
        <div className="AdStatisticsLink-inner">
            <span className="AdStatisticsLink__text">Se status for jobbmarkedet</span>
            <span className="Header__Lenkeikon"/>
        </div>
    </a>
);

export default AdStatisticsLink;
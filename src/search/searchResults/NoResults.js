import React from 'react';
import './NoResults.less';
import SaveSearchButton from "../../savedSearches/SaveSearchButton";

function NoResults() {
    return (
        <div className="NoResults">
            <div className="NoResults__text__container">
                <div className="NoResults__text__title">
                    Ingen stillinger akkurat nå
                </div>
                <br/>
                <div className="NoResults__text__desc">
                    Vil du lagre dette søket? Da kan du få varsel når det kommer nye stillinger.
                </div>
            </div>
            <SaveSearchButton/>
        </div>
    );
}

export default NoResults;

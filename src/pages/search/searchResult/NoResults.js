import React from "react";
import "./NoResults.less";
import SaveSearchButton from "../../savedSearches/SaveSearchButton";
import { toReadableQuery } from "../query";

function NoResults({ query }) {
    return (
        <section className="NoResults">
            <h3 className="NoResults__title">Ingen stillinger akkurat nå</h3>
            <p className="NoResults__text">
                Søket ditt på <span className="bold">&laquo;{toReadableQuery(query)}&raquo;</span> ga ingen treff.
            </p>
            <p className="NoResults__text">
                Vil du lagre dette søket? Da kan du få varsel når det kommer nye stillinger.
            </p>
            <SaveSearchButton query={query} />
        </section>
    );
}

export default NoResults;

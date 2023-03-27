import React from "react";
import SaveSearchButton from "../../../saved-searches/components/SaveSearchButton";
import { toReadableQuery } from "../../query";
import { BodyLong, Heading, Panel } from "@navikt/ds-react";

function NoResults({ query }) {
    return (
        <Panel className="arb-panel arb-panel-lofty arb-secondary-bg-text mt-2">
            <Heading level="3" size="medium" spacing>
                Ingen stillinger akkurat nå
            </Heading>
            <BodyLong className="mb-1">
                Søket ditt på <span className="bold">&laquo;{toReadableQuery(query)}&raquo;</span> ga ingen treff.
            </BodyLong>
            <BodyLong spacing>Vil du lagre dette søket? Da kan du få varsel når det kommer nye stillinger.</BodyLong>
            <SaveSearchButton query={query} />
        </Panel>
    );
}

export default NoResults;

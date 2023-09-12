import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, Panel } from "@navikt/ds-react";
import SaveSearchButton from "../../../saved-searches/components/SaveSearchButton";
import "./HowToPanel.css";

function DoYouWantToSaveSearch({ query }) {
    return (
        <Panel className="HowToPanel arb-panel-secondary mb-8">
            <div className="HowToPanel__text">
                <Heading level="3" size="small">
                    Varsel ved nye treff?
                </Heading>
                <BodyLong>Lagre søket og motta e-post ved nye treff.</BodyLong>
            </div>
            <SaveSearchButton query={query} />
        </Panel>
    );
}

DoYouWantToSaveSearch.propTypes = {
    query: PropTypes.shape({}),
};

export default DoYouWantToSaveSearch;

import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Heading, Panel, VStack } from "@navikt/ds-react";
import SaveSearchButton from "../../../lagrede-sok/components/SaveSearchButton";

function DoYouWantToSaveSearch({ query }) {
    return (
        <Panel className="arb-panel-secondary mb-8">
            <VStack align="center">
                <Heading level="3" size="small" className="text-center" spacing>
                    Varsel ved nye treff?
                </Heading>
                <BodyShort className="text-center" spacing>
                    Lagre søket og motta e-post ved nye treff.
                </BodyShort>
                <SaveSearchButton query={query} />
            </VStack>
        </Panel>
    );
}

DoYouWantToSaveSearch.propTypes = {
    query: PropTypes.shape({}),
};

export default DoYouWantToSaveSearch;

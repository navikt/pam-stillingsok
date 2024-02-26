import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "../../../lagrede-sok/_components/SaveSearchButton";

function DoYouWantToSaveSearch({ query }) {
    return (
        <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-2-subtle">
            <VStack align="center">
                <Heading level="3" size="small" className="text-center" spacing>
                    Varsel ved nye treff?
                </Heading>
                <BodyShort className="text-center" spacing>
                    Lagre søket og motta e-post ved nye treff.
                </BodyShort>
                <SaveSearchButton query={query} />
            </VStack>
        </Box>
    );
}

DoYouWantToSaveSearch.propTypes = {
    query: PropTypes.shape({}),
};

export default DoYouWantToSaveSearch;

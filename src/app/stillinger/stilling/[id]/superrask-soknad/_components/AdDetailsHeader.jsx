import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Label } from "@navikt/ds-react";
import getEmployer from "../../../../../../../server/common/getEmployer";

function AdDetailsHeader({ source }) {
    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4" className="mb-12">
            <div className="container-medium">
                <Label as="p" className="mb-1">
                    {getEmployer(source)}
                </Label>
                <BodyShort>{source.title}</BodyShort>
            </div>
        </Box>
    );
}

AdDetailsHeader.propTypes = {
    source: PropTypes.shape({
        title: PropTypes.string,
    }),
};

export default AdDetailsHeader;

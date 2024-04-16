import { BodyShort, Box, Label } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import getEmployer from '@/app/_common/utils/getEmployer';

const AdDetailsHeader = ({ source }) => (
  <Box background="surface-alt-1-subtle" className="mb-10" paddingBlock="4">
    <div className="container-medium">
      <Label as="p" className="mb-1">
        {getEmployer(source)}
      </Label>
      <BodyShort>{source.title}</BodyShort>
    </div>
  </Box>
);

AdDetailsHeader.propTypes = {
  source: PropTypes.shape({
    title: PropTypes.string,
  }),
};

export default AdDetailsHeader;

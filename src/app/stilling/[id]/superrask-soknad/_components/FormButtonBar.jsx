import { Button } from '@navikt/ds-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { useFormStatus } from 'react-dom';

export const FormButtonBar = ({ id }) => {
  const { pending } = useFormStatus();
  return (
    <>
      <Button loading={pending} type="submit" variant="primary">
        Send søknad
      </Button>
      {!pending && (
        <Button as={Link} href={`/stilling/${id}`} type="button" variant="secondary">
          Avbryt
        </Button>
      )}
    </>
  );
};
FormButtonBar.propTypes = {
  id: PropTypes.string.isRequired,
};

import { Button } from '@navikt/ds-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export function WithdrawButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} type="submit" variant="primary">
      Trekk søknad
    </Button>
  );
}

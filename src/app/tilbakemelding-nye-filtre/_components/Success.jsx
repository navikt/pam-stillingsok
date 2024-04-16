import {
  Link as AkselLink, BodyLong, Button, Heading,
} from '@navikt/ds-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

const Success = () => {
  const ref = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <div className="container-small mt-12 mb-24 text-center">
      <Heading
        ref={ref}
        spacing
        aria-live="polite"
        className="no-focus-outline"
        level="1"
        role="alert"
        size="large"
        tabIndex={-1}
      >
        Takk for tilbakemeldingen din ✨
      </Heading>
      <BodyLong spacing>Har du flere tanker eller forslag hører vi gjerne fra deg!</BodyLong>
      <BodyLong spacing>
        <AkselLink href="https://surveys.hotjar.com/e00d7167-285f-43ed-b14f-d65db5910559">
          Klikk her for å dele dine idéer med oss
        </AkselLink>
      </BodyLong>
      <Button as={Link} href="/" variant="primary">
        Tilbake til søket
      </Button>
    </div>
  );
};

export default Success;

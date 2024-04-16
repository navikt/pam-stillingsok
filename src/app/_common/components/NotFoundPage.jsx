'use client';

import { NotFound } from '@navikt/arbeidsplassen-react';
import PropTypes from 'prop-types';
import React from 'react';

export default function NotFoundPage({ title, text }) {
  return (
    <div className="container-large mt-12 mb-24">
      <NotFound text={text} title={title} />
    </div>
  );
}

NotFoundPage.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

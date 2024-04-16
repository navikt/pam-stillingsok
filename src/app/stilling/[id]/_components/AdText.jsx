import { RichText } from '@navikt/arbeidsplassen-react';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import React from 'react';

export default function AdText({ adText }) {
  const options = {

    replace: ({ attribs }) => {
      if (attribs && attribs.id === 'arb-aapningstekst') {
        return null;
      }
    },
  };

  if (adText) {
    if (adText.includes('arb-aapningstekst')) {
      return <RichText className="job-posting-text">{parse(adText, options)}</RichText>;
    }
    return <RichText className="job-posting-text">{parse(adText)}</RichText>;
  }
  return null;
}

AdText.propTypes = {
  adText: PropTypes.string,
};

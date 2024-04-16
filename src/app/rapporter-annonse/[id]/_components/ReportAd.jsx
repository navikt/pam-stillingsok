'use client';

import {
  Link as AkselLink,
  Bleed,
  BodyLong,
  BodyShort,
  Box,
  Checkbox,
  CheckboxGroup,
  ErrorSummary,
  HStack,
  Heading,
  LinkPanel,
  Textarea,
  VStack,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import ApiErrorMessage from '@/app/_common/components/ApiErrorMessage';

import { FormButtonBar } from './FormButtonBar';

const reportCategories = [
  { label: 'Diskriminerende innhold', key: 'discrimination' },
  { label: 'Det er markedsføring', key: 'marketing' },
  { label: 'Falsk stillingannonse og arbeidsgiver', key: 'fake' },
  { label: 'Krever betaling for å søke stilling', key: 'payment' },
  { label: 'Ber om kredittinfo og/eller BankID', key: 'creditInfo' },
  { label: 'Annet', key: 'other' },
];

const ReportAd = ({ ad, submitForm }) => {
  const errorSummary = useRef();
  const ref = useRef(null);
  const [description, setDescription] = useState('');

  const [state, setState] = useState({ validationErrors: {}, success: false, error: false });
  const { validationErrors } = state;
  const [fixedErrors, setFixedErrors] = useState([]);
  const [localSummary, setLocalSummary] = useState(validationErrors);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  useEffect(() => {
    setFixedErrors([]);
    setLocalSummary(validationErrors);
  }, [validationErrors]);

  useEffect(() => {
    if (fixedErrors.length === 0 && Object.keys(localSummary).length > 0) {
      errorSummary.current.focus();
    }
  }, [localSummary, fixedErrors, errorSummary]);

  const onSubmit = async (e) => {
    e.preventDefault();

    let result;
    let fetchSuccess;
    const formData = new FormData(e.target);

    try {
      result = await submitForm(formData);
      fetchSuccess = true;
    } catch (err) {
      fetchSuccess = false;
    }

    if (fetchSuccess) {
      setState(result);
    } else {
      setState((prevState) => ({
        ...prevState,
        error: 'offline',
      }));
    }
  };

  function setErrorAsFixed(fixed) {
    if (!fixedErrors.includes(fixed)) {
      setFixedErrors((prevState) => [...prevState, fixed]);

      const localSummaryWithoutFixes = {
        ...localSummary,
      };
      delete localSummaryWithoutFixes[fixed];
      setLocalSummary(localSummaryWithoutFixes);
    }
  }

  return (
    <>
      <Bleed className="mb-10">
        <Box background="surface-alt-1-subtle" paddingBlock="4">
          <div className="container-small">
            <BodyShort weight="semibold">{ad._source.title}</BodyShort>
            <BodyShort>{ad._source.businessName}</BodyShort>
          </div>
        </Box>
      </Bleed>
      <div className="container-small mb-24">
        <div>
          {state.success ? (
            <div>
              <Heading
                ref={ref}
                aria-live="polite"
                className="mb-4"
                level="1"
                role="alert"
                size="xlarge"
                tabIndex={-1}
              >
                Takk for din tilbakemelding
              </Heading>

              <div className="report-form mb-12">
                <BodyLong spacing>Takk for at du tok deg tid til å rapportere denne annonsen.</BodyLong>
                <BodyLong spacing>
                  Har du spørsmål kan du 
{' '}
<AkselLink href="/kontakt">kontakte oss her.</AkselLink>
                </BodyLong>
                <BodyLong>Med vennlig hilsen arbeidsplassen.no</BodyLong>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <Heading className="mb-4" level="1" size="xlarge">
                Rapporter annonse
              </Heading>

              <BodyLong className="mb-8">
                Alle annonser på arbeidsplassen.no skal følge
                {' '}
                <AkselLink className="display-inline" href="/retningslinjer-stillingsannonser">
                  NAVs retningslinjer for stillingsannonser
                          </AkselLink>
                . I tilfeller der det er brudd på retningslinjene vil stillingsannonsene bli fjernet.
              </BodyLong>

              {Object.keys(localSummary).length > 0 && (
                <ErrorSummary
                  ref={errorSummary}
                  className="mb-12"
                  heading="Du må rette noen feil før du kan rapportere annonsen"
                >
                  {Object.entries(localSummary).map(([key, value]) => (
                    <ErrorSummary.Item key={key} href={`#${key}`}>
                          {value}
                        </ErrorSummary.Item>
                  ))}
                </ErrorSummary>
              )}

              <CheckboxGroup
                className="mb-8"
                description="Velg minst èn"
                error={!fixedErrors.includes('categoryFieldset') && validationErrors.categoryFieldset}
                id="categoryFieldset"
                legend="Velg hvilke retningslinjer annonsen bryter"
                onChange={() => {
                  setErrorAsFixed('categoryFieldset');
                }}
              >
                {reportCategories.map((c) => (
                  <Checkbox key={c.key} name="category" value={c.label} onChange={() => {}}>
                      {c.label}
                    </Checkbox>
                ))}
              </CheckboxGroup>
              <Textarea
                className="mb-8"
                description="Valgfritt. Vennligst ikke skriv inn personopplysninger."
                error={!fixedErrors.includes('messageField') && validationErrors.messageField}
                id="messageField"
                label="Legg til utdypende informasjon"
                maxLength={300}
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrorAsFixed('messageField');
                }}
              />
              <BodyLong className="mb-4">
                Når du har sendt inn tipset, vurderer vi om annonsen bryter retningslinjene og om den
                skal fjernes. Ditt tips er anonymt.
              </BodyLong>

              {state?.error ? <ApiErrorMessage apiErrorCode={state.error} /> : null}

              <HStack className="mb-12" gap="4">
                <FormButtonBar id={ad._id} />
              </HStack>
            </form>
          )}

          <VStack gap="4">
            <LinkPanel className="arb-link-panel-tertiary" href="https://tips.skatteetaten.no/web/tips/">
              <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                Send tips til Skatteetaten
              </LinkPanel.Title>
              <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                Ved mistanke om for eksempel svart arbeid eller ulovlig utleie.
              </LinkPanel.Description>
            </LinkPanel>
            <LinkPanel
              className="arb-link-panel-tertiary"
              href="https://www.arbeidstilsynet.no/kontakt-oss/tips/"
            >
              <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                Send tips til Arbeidstilsynet
              </LinkPanel.Title>
              <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                Ved mistanke om kritikkverdige arbeidsmiljøforhold.
              </LinkPanel.Description>
            </LinkPanel>
          </VStack>
        </div>
      </div>
    </>
  );
};

ReportAd.propTypes = {
  ad: PropTypes.shape({
    _id: PropTypes.string,
    _source: PropTypes.shape({
      businessName: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  validationErrors: PropTypes.shape({
    categoryFieldset: PropTypes.string,
    messageField: PropTypes.string,
  }),
};

export default ReportAd;

import {
  Link as AkselLink,
  BodyLong,
  Checkbox,
  CheckboxGroup,
  ErrorSummary,
  HStack,
  Heading,
  ReadMore,
  TextField,
  Textarea,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import ApiErrorMessage from '@/app/_common/components/ApiErrorMessage';

import { FormButtonBar } from './FormButtonBar';
import { MOTIVATION_MAX_LENGTH } from './validateForm';

function Form({
  ad, applicationForm, submitApplication, submitApiError, offlineError, validationErrors,
}) {
  const errorSummary = useRef();
  const [motivation, setMotivation] = useState('');
  const [fixedErrors, setFixedErrors] = useState([]);
  const [localSummary, setLocalSummary] = useState(validationErrors);

  useEffect(() => {
    setFixedErrors([]);
    setLocalSummary(validationErrors);
  }, [validationErrors]);

  useEffect(() => {
    if (fixedErrors.length === 0 && Object.keys(localSummary).length > 0) {
      errorSummary.current.focus();
    }
  }, [localSummary, fixedErrors, errorSummary]);

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
    <form action={submitApplication}>
      <section className="mb-10">
        <Heading spacing level="1" size="xlarge">
          Superrask søknad
        </Heading>
        <BodyLong spacing>
          Ingen CV eller langt søknadsbrev, kun tre raske steg. Du får beskjed på e-post med en gang bedriften
          har vurdert søknaden din.
        </BodyLong>
        {Object.entries(localSummary).length > 0 && (
        <ErrorSummary ref={errorSummary} heading="Skjemaet inneholder feil">
          {Object.entries(localSummary).map(([key, value]) => (
            <ErrorSummary.Item key={key} href={`#new-application-${key}`}>
              {value}
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
        )}
      </section>

      {applicationForm.qualifications && applicationForm.qualifications.length > 0 ? (
        <section className="mb-10">
          <Heading spacing level="2" size="medium">
            Bedriftens ønskede kvalifikasjoner
          </Heading>
          <BodyLong className="mb-8">
            Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
          </BodyLong>

          {applicationForm.qualifications && applicationForm.qualifications.length > 0 ? (
            <CheckboxGroup legend="Huk av for kvalifikasjonene du oppfyller">
              {applicationForm.qualifications.map((it) => (
                <Checkbox key={it.id} name="qualification" value={it.label}>
                  {it.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          ) : null}
        </section>
      ) : null}

      <section className="mb-10">
        <Heading spacing level="2" size="medium">
          Hvorfor du er den rette for jobben
        </Heading>
        <ReadMore className="mb-4" header="Hvordan skrive en god begrunnelse?">
          <BodyLong className="mb-4">
            Vis hvorfor du er et trygt valg for denne jobben. Fortell om arbeidserfaring, praksisplasser,
            utdanning, frivillig arbeid, verv eller annen relevant erfaring.
          </BodyLong>
          <BodyLong>
            Tenk gjerne litt utradisjonelt og husk at personlige egenskaper kan være avgjørende.
          </BodyLong>
        </ReadMore>
        <Textarea
          error={!fixedErrors.includes('motivation') && validationErrors.motivation}
          id="new-application-motivation"
          label="Skriv en begrunnelse"
          maxLength={MOTIVATION_MAX_LENGTH}
          name="motivation"
          value={motivation}
          onChange={(e) => {
            setMotivation(e.target.value);
            setErrorAsFixed('motivation');
          }}
        />
      </section>

      <section className="mb-10">
        <Heading spacing level="2" size="medium">
          Din kontaktinformasjon
        </Heading>
        <BodyLong className="mb-4">Vær nøye med å oppgi riktig informasjon.</BodyLong>

        <TextField
          auto-complete="name"
          className="mb-4"
          id="new-application-name"
          label="Navn"
          name="fullName"
        />

        <TextField
          aria-required="true"
          auto-complete="email"
          className="mb-4"
          description="Må fylles ut"
          error={!fixedErrors.includes('email') && validationErrors.email}
          id="new-application-email"
          label="E-post"
          name="email"
          type="text"
          onChange={() => {
            setErrorAsFixed('email');
          }}
        />

        <TextField
          aria-required="true"
          auto-complete="tel"
          description="Må fylles ut"
          error={!fixedErrors.includes('telephone') && validationErrors.telephone}
          id="new-application-telephone"
          label="Telefonnummer"
          name="telephone"
          type="tel"
          onChange={() => {
            setErrorAsFixed('telephone');
          }}
        />
      </section>

      <BodyLong spacing>
        Når du har sendt søknaden, kan bedriften se begrunnelsen din og hvilke kvalifikasjoner du har huket av,
        samt navnet ditt dersom du har oppgitt det. Hvis bedriften ønsker å kontakte deg, får de også se
        kontaktinformasjonen din.
      </BodyLong>
      <BodyLong spacing>Du kan når som helst trekke tilbake søknaden din.</BodyLong>
      <BodyLong spacing>
        <AkselLink href="/personvern-superrask-soknad" rel="noopener noreferrer" target="_blank">
          Les om hvordan vi behandler dine data (åpner i ny fane)
        </AkselLink>
      </BodyLong>

      {submitApiError ? <ApiErrorMessage apiErrorCode={submitApiError} /> : null}
      {offlineError && !submitApiError ? <ApiErrorMessage apiErrorCode="offline" /> : null}

      <HStack className="mt-12" gap="4">
        <FormButtonBar id={ad._id} />
      </HStack>
    </form>
  );
}

Form.propTypes = {
  ad: PropTypes.shape({
    _id: PropTypes.string,
    _source: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  applicationForm: PropTypes.shape({
    qualifications: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
  }).isRequired,
  submitApplication: PropTypes.func.isRequired,
  submitApiError: PropTypes.string,
  offlineError: PropTypes.bool,
  validationErrors: PropTypes.shape({
    email: PropTypes.string,
    telephone: PropTypes.string,
    motivation: PropTypes.string,
  }),
};

export default Form;

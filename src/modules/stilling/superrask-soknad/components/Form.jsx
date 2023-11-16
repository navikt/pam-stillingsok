import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    BodyLong,
    Button,
    Checkbox,
    ErrorSummary,
    Fieldset,
    Heading,
    HStack,
    Link as AkselLink,
    ReadMore,
    Textarea,
    TextField,
} from "@navikt/ds-react";
import { Link } from "react-router-dom";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import { MOTIVATION_MAX_LENGTH } from "./validateForm";
import ApiErrorMessage from "./ApiErrorMessage";

function Form({ ad, applicationForm, submitForm, pending, submitApiError, validationErrors }) {
    const errorSummary = useRef();
    const [hideMotivationError, setHideMotivationError] = useState(false);
    const [hideEmailError, setHideEmailError] = useState(false);
    const [hideTelephoneError, setHideTelephoneError] = useState(false);

    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            errorSummary.current.focus();
        }
        setHideMotivationError(false);
        setHideEmailError(false);
        setHideTelephoneError(false);
    }, [validationErrors]);

    return (
        <form onSubmit={submitForm} className="mb-16">
            <section className="mb-10">
                <H1WithAutoFocus>Superrask søknad</H1WithAutoFocus>
                <BodyLong spacing>
                    Ingen CV eller langt søknadsbrev, kun tre raske steg. Du får beskjed på e-post med en gang bedriften
                    har vurdert søknaden din.
                </BodyLong>
                {Object.keys(validationErrors).length > 0 && (
                    <ErrorSummary ref={errorSummary} heading="Skjemaet inneholder feil">
                        {Object.entries(validationErrors).map(([key, value]) => (
                            <ErrorSummary.Item key={key} href={`#new-application-${key}`}>
                                {value}
                            </ErrorSummary.Item>
                        ))}
                    </ErrorSummary>
                )}
            </section>

            {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                <section className="mb-10">
                    <Heading level="2" size="medium" spacing>
                        Bedriftens ønskede kvalifikasjoner
                    </Heading>
                    <BodyLong className="mb-8">
                        Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                    </BodyLong>

                    {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                        <Fieldset legend="Huk av for kvalifikasjonene du oppfyller">
                            {applicationForm.qualifications.map((it) => (
                                <Checkbox key={it.id} value={it.label} name="qualification">
                                    {it.label}
                                </Checkbox>
                            ))}
                        </Fieldset>
                    )}
                </section>
            )}

            <section className="mb-10">
                <Heading level="2" size="medium" spacing>
                    Hvorfor du er den rette for jobben
                </Heading>
                <ReadMore header="Hvordan skrive en god begrunnelse?" className="mb-4">
                    <BodyLong className="mb-4">
                        Vis hvorfor du er et trygt valg for denne jobben. Fortell om arbeidserfaring, praksisplasser,
                        utdanning, frivillig arbeid, verv eller annen relevant erfaring.
                    </BodyLong>
                    <BodyLong>
                        Tenk gjerne litt utradisjonelt og husk at personlige egenskaper kan være avgjørende.
                    </BodyLong>
                </ReadMore>
                <Textarea
                    id="new-application-checkedQualifications"
                    label="Skriv en begrunnelse"
                    name="motivation"
                    onChange={() => {
                        setHideMotivationError(true);
                    }}
                    maxLength={MOTIVATION_MAX_LENGTH}
                    error={!hideMotivationError && validationErrors.motivation}
                />
            </section>

            <section className="mb-10">
                <Heading level="2" size="medium" spacing>
                    Din kontaktinformasjon
                </Heading>
                <BodyLong className="mb-4">Vær nøye med å oppgi riktig informasjon.</BodyLong>

                <TextField label="Navn" id="new-application-name" auto-complete="name" name="name" className="mb-4" />

                <TextField
                    label="E-post"
                    description="Må fylles ut"
                    type="email"
                    name="email"
                    auto-complete="email"
                    aria-required="true"
                    id="new-application-email"
                    onChange={() => {
                        setHideEmailError(true);
                    }}
                    error={!hideEmailError && validationErrors.email}
                    className="mb-4"
                />

                <TextField
                    label="Telefonnummer"
                    description="Må fylles ut"
                    id="new-application-telephone"
                    type="tel"
                    name="telephone"
                    auto-complete="tel"
                    aria-required="true"
                    onChange={() => {
                        setHideTelephoneError(true);
                    }}
                    error={!hideTelephoneError && validationErrors.telephone}
                />
            </section>

            <BodyLong spacing>
                Når du har sendt søknaden, kan bedriften se begrunnelsen din og hvilke kvalifikasjoner du har huket av,
                samt navnet ditt dersom du har oppgitt det. Hvis bedriften ønsker å kontakte deg, får de også se
                kontaktinformasjonen din.
            </BodyLong>
            <BodyLong spacing>Du kan når som helst trekke tilbake søknaden din.</BodyLong>
            <BodyLong>
                <AkselLink target="_blank" rel="noopener noreferrer" href="/personvern-superrask-soknad">
                    Les om hvordan vi behandler dine data (åpner i ny fane)
                </AkselLink>
            </BodyLong>

            {submitApiError && <ApiErrorMessage apiErrorCode={submitApiError} />}

            <HStack gap="4" className="mt-12">
                <Button variant="primary" loading={pending} type="submit">
                    Send søknad
                </Button>
                <Button disabled={pending} variant="secondary" as={Link} to={`/stillinger/stilling/${ad._id}`}>
                    Avbryt
                </Button>
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
    submitForm: PropTypes.func.isRequired,
    pending: PropTypes.bool,
    submitApiError: PropTypes.shape({
        message: PropTypes.string,
    }),
    validationErrors: PropTypes.shape({
        email: PropTypes.string,
        telephone: PropTypes.string,
        motivation: PropTypes.string,
    }),
};

export default Form;

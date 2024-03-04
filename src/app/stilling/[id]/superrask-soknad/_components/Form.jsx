import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    BodyLong,
    Checkbox,
    CheckboxGroup,
    ErrorSummary,
    Heading,
    HStack,
    Link as AkselLink,
    ReadMore,
    Textarea,
    TextField,
} from "@navikt/ds-react";
import { MOTIVATION_MAX_LENGTH } from "./validateForm";
import ApiErrorMessage from "./ApiErrorMessage";
import { FormButtonBar } from "./FormButtonBar";

function Form({ ad, applicationForm, submitApplication, submitApiError, validationErrors }) {
    const errorSummary = useRef();
    const [motivation, setMotivation] = useState("");
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
        <form action={submitApplication} className="mb-16">
            <section className="mb-10">
                <Heading level="1" size="xlarge" spacing>
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

            {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                <section className="mb-10">
                    <Heading level="2" size="medium" spacing>
                        Bedriftens ønskede kvalifikasjoner
                    </Heading>
                    <BodyLong className="mb-8">
                        Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                    </BodyLong>

                    {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                        <CheckboxGroup legend="Huk av for kvalifikasjonene du oppfyller">
                            {applicationForm.qualifications.map((it) => (
                                <Checkbox key={it.id} value={it.label} name="qualification">
                                    {it.label}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
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
                    id="new-application-motivation"
                    label="Skriv en begrunnelse"
                    name="motivation"
                    value={motivation}
                    onChange={(e) => {
                        setMotivation(e.target.value);
                        setErrorAsFixed("motivation");
                    }}
                    maxLength={MOTIVATION_MAX_LENGTH}
                    error={!fixedErrors.includes("motivation") && validationErrors.motivation}
                />
            </section>

            <section className="mb-10">
                <Heading level="2" size="medium" spacing>
                    Din kontaktinformasjon
                </Heading>
                <BodyLong className="mb-4">Vær nøye med å oppgi riktig informasjon.</BodyLong>

                <TextField
                    label="Navn"
                    id="new-application-name"
                    auto-complete="name"
                    name="fullName"
                    className="mb-4"
                />

                <TextField
                    label="E-post"
                    description="Må fylles ut"
                    type="text"
                    name="email"
                    auto-complete="email"
                    aria-required="true"
                    id="new-application-email"
                    onChange={() => {
                        setErrorAsFixed("email");
                    }}
                    error={!fixedErrors.includes("email") && validationErrors.email}
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
                        setErrorAsFixed("telephone");
                    }}
                    error={!fixedErrors.includes("telephone") && validationErrors.telephone}
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
    validationErrors: PropTypes.shape({
        email: PropTypes.string,
        telephone: PropTypes.string,
        motivation: PropTypes.string,
    }),
};

export default Form;

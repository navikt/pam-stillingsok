import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    BodyLong,
    Button,
    Checkbox,
    ErrorSummary,
    Heading,
    ReadMore,
    Textarea,
    TextField,
    Link as AkselLink,
    Fieldset,
} from "@navikt/ds-react";
import Alert from "../../../common/components/alert/Alert";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import { isValidEmail, isValidTelephone } from "../../../common/components/utils";
import "./SuperraskSoknad.css";
import { CONTEXT_PATH } from "../../../common/environment";

function NewApplicationForm({ ad, applicationForm, submitForm, isSending, hasError, error }) {
    // Form data
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [motivation, setMotivation] = useState("");
    const [qualificationsFocusErrorSummary, setQualificationsFocusErrorSummary] = useState(false);
    const [checkedQualifications, setCheckedQualifications] = useState([]);

    // Validation
    const [telephoneValidationError, setTelephoneValidationError] = useState(undefined);
    const [emailValidationError, setEmailValidationError] = useState(undefined);
    const [motivationValidationError, setMotivationValidationError] = useState(undefined);
    const errorSummary = useRef();

    const MOTIVATION_MAX_LENGTH = 800;

    useEffect(() => {
        if (qualificationsFocusErrorSummary) {
            errorSummary.current.focus();
        }
    }, [qualificationsFocusErrorSummary]);

    function handleFormSubmit(e) {
        e.preventDefault();
        return false;
    }

    function validateForm() {
        let isValid = true;
        setQualificationsFocusErrorSummary(false);

        if (email && email.length > 0 && !isValidEmail(email)) {
            isValid = false;
            setEmailValidationError("E-postadressen er ugyldig");
        } else if (email === undefined || email.trim().length === 0) {
            isValid = false;
            setEmailValidationError("Du må oppgi din e-post for å kunne sende inn søknaden");
        }

        if (telephone.trim().length > 0 && !isValidTelephone(telephone)) {
            isValid = false;
            setTelephoneValidationError("Telefonnummer er ugyldig");
        } else if (telephone === undefined || telephone.trim().length === 0) {
            isValid = false;
            setTelephoneValidationError("Du må oppgi ditt telefonnummer for å kunne sende inn søknaden");
        }

        if (motivation.length > MOTIVATION_MAX_LENGTH) {
            isValid = false;
            setMotivationValidationError(
                `Du har brukt ${
                    motivation.length - MOTIVATION_MAX_LENGTH
                } tegn for mye i din begrunnelse. Begrunnelsen kan ikke være lengre enn ${MOTIVATION_MAX_LENGTH} tegn`,
            );
        }
        if (!isValid) {
            setQualificationsFocusErrorSummary(true);
        }
        return isValid;
    }

    function handleSendMessageClick() {
        if (validateForm()) {
            submitForm({
                name,
                telephone,
                email,
                motivation,
                qualifications: applicationForm.qualifications.map((it) => ({
                    ...it,
                    checked: checkedQualifications.includes(it.label),
                })),
            });
        }
    }

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleTelephoneChange(e) {
        setQualificationsFocusErrorSummary(false);
        setTelephoneValidationError(undefined);
        setTelephone(e.target.value);
    }

    function handleEmailChange(e) {
        setQualificationsFocusErrorSummary(false);
        setEmailValidationError(undefined);
        setEmail(e.target.value);
    }

    function handleMotivationChange(e) {
        setQualificationsFocusErrorSummary(false);
        setMotivationValidationError(undefined);
        setMotivation(e.target.value);
    }

    function handleQualificationsCheck(e) {
        const { checked, value } = e.target;
        if (checked) {
            setCheckedQualifications((prevState) => (prevState.includes(value) ? prevState : [...prevState, value]));
        } else {
            setCheckedQualifications((prevState) => prevState.filter((it) => it !== value));
        }
    }

    const getErrorMessage = (err) => {
        switch (err.message) {
            case "invalid_name":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at navnet ditt er skrevet riktig og prøv på nytt.";
            case "invalid_email":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at e-posten din er skrevet riktig og prøv på nytt. Eksempel: epost@mail.no";
            case "invalid_telephone":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at telefonnummeret ditt er skrevet riktig og prøv på nytt. Eksempel: +47 99 99 99 99";
            case "invalid_motivation":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at begrunnelsen din ikke inneholder noen lenker eller er lenger enn 800 tegn.";
            default:
                return "Det oppsto dessverre en feil og vi kunne ikke sende inn søknaden din. Prøv å send søknaden på nytt.";
        }
    };

    const errors = [];
    if (telephoneValidationError)
        errors.push(
            <ErrorSummary.Item href="#new-application-telephone" key="1">
                {telephoneValidationError}
            </ErrorSummary.Item>,
        );
    if (emailValidationError)
        errors.push(
            <ErrorSummary.Item href="#new-application-email" key="2">
                {emailValidationError}
            </ErrorSummary.Item>,
        );
    if (motivationValidationError)
        errors.push(
            <ErrorSummary.Item href="#new-application-motivation" key="3">
                {motivationValidationError}
            </ErrorSummary.Item>,
        );

    return (
        <form onSubmit={handleFormSubmit}>
            <section className="NewApplicationForm__section">
                <H1WithAutoFocus>Superrask søknad</H1WithAutoFocus>
                <BodyLong spacing>
                    Ingen CV eller langt søknadsbrev, kun tre raske steg. Du får beskjed på e-post med en gang bedriften
                    har vurdert søknaden din.
                </BodyLong>
                <BodyLong spacing>* felter du må fylle ut</BodyLong>
                {errors.length > 0 && (
                    <ErrorSummary ref={errorSummary} heading="Skjemaet inneholder feil">
                        {errors}
                    </ErrorSummary>
                )}
            </section>

            {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                <section className="NewApplicationForm__section">
                    <Heading level="2" size="medium" spacing>
                        Bedriftens ønskede kvalifikasjoner
                    </Heading>
                    <BodyLong className="mb-2">
                        Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                    </BodyLong>

                    {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                        <Fieldset legend="Huk av for kvalifikasjonene du oppfyller">
                            {applicationForm.qualifications.map((it) => (
                                <Checkbox
                                    key={it.id}
                                    value={it.label}
                                    onChange={handleQualificationsCheck}
                                    checked={checkedQualifications.includes(it.label)}
                                >
                                    {it.label}
                                </Checkbox>
                            ))}
                        </Fieldset>
                    )}
                </section>
            )}

            <section className="NewApplicationForm__section">
                <Heading level="2" size="medium" spacing>
                    Hvorfor du er den rette for jobben
                </Heading>
                <ReadMore header="Hvordan skrive en god begrunnelse?" className="mb-1">
                    <BodyLong className="mb-1">
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
                    onChange={handleMotivationChange}
                    value={motivation}
                    maxLength={MOTIVATION_MAX_LENGTH}
                    error={motivationValidationError}
                />
            </section>

            <section className="NewApplicationForm__section">
                <Heading level="2" size="medium" spacing>
                    Din kontaktinformasjon
                </Heading>
                <BodyLong className="mb-1">Vær nøye med å oppgi riktig informasjon.</BodyLong>

                <TextField
                    label="Navn"
                    id="new-application-name"
                    auto-complete="name"
                    onChange={handleNameChange}
                    value={name}
                    className="mb-1"
                />

                <TextField
                    label="E-post *"
                    type="email"
                    auto-complete="email"
                    aria-required="true"
                    id="new-application-email"
                    onChange={handleEmailChange}
                    value={email}
                    error={emailValidationError}
                    className="mb-1"
                />

                <TextField
                    label="Telefonnummer *"
                    id="new-application-telephone"
                    type="tel"
                    auto-complete="tel"
                    aria-required="true"
                    onChange={handleTelephoneChange}
                    value={telephone}
                    error={telephoneValidationError}
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

            {hasError && <Alert>{getErrorMessage(error)}</Alert>}

            <div className="NewApplicationForm__buttons">
                <Button variant="primary" loading={isSending} type="button" onClick={handleSendMessageClick}>
                    Send søknad
                </Button>
                <Button disabled={isSending} variant="secondary" as={Link} to={`${CONTEXT_PATH}/stilling/${ad._id}`}>
                    Avbryt
                </Button>
            </div>
        </form>
    );
}

NewApplicationForm.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string,
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
    isSending: PropTypes.bool,
    hasError: PropTypes.bool,
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
};

export default NewApplicationForm;

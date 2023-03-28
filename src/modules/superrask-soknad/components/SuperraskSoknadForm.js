import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../../common/components/alert/Alert";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import {
    BodyLong,
    Button,
    Checkbox,
    ErrorSummary,
    Heading,
    Loader,
    ReadMore,
    Textarea,
    TextField
} from "@navikt/ds-react";
import { isValidEmail } from "../../../common/components/utils";
import "./SuperraskSoknad.css";
import { CONTEXT_PATH } from "../../../common/environment";

const SuperraskSoknadForm = ({ ad, interestForm, isInternal, submitForm, isSending, hasError, error }) => {
    // Form data
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [about, setAbout] = useState("");
    const [shouldFocusErrorSummary, setShouldFocusErrorSummary] = useState(false);
    const [checkedMustRequirements, setCheckedMustRequirements] = useState([]);
    const [checkedShouldRequirements, setCheckedShouldRequirements] = useState([]);

    // Validation
    const [telephoneValidationError, setTelephoneValidationError] = useState(undefined);
    const [emailValidationError, setEmailValidationError] = useState(undefined);
    const [aboutValidationError, setAboutValidationError] = useState(undefined);
    const errorSummary = useRef();

    const ABOUT_MAX_LENGTH = 400;

    useEffect(() => {
        if (shouldFocusErrorSummary) {
            errorSummary.current.focus();
        }
    }, [shouldFocusErrorSummary]);

    function handleFormSubmit(e) {
        e.preventDefault();
        return false;
    }

    function handleSendMessageClick() {
        if (validateForm()) {
            submitForm({
                name,
                telephone: telephone,
                email,
                about,
                must: interestForm.must.map((it) => ({
                    ...it,
                    checked: checkedMustRequirements.includes(it.label)
                })),
                should: interestForm.should.map((it) => ({
                    ...it,
                    checked: checkedShouldRequirements.includes(it.label)
                }))
            });
        }
    }

    function validateForm() {
        let isValid = true;
        setShouldFocusErrorSummary(false);

        if (email && email.length > 0 && !isValidEmail(email)) {
            isValid = false;
            setEmailValidationError("E-postadressen er ugyldig");
        } else if (email === undefined || email.trim().length === 0) {
            isValid = false;
            setEmailValidationError("Du må oppgi din e-post for å kunne sende inn søknaden");
        }

        if (telephone.trim().length === 0) {
            isValid = false;
            setTelephoneValidationError("Du må oppgi ditt telefonnummer for å kunne sende inn søknaden");
        }

        if (about.length > ABOUT_MAX_LENGTH) {
            isValid = false;
            setAboutValidationError(
                `Du har brukt ${
                    about.length - ABOUT_MAX_LENGTH
                } tegn for mye i din begrunnelse. Begrunnelsen kan ikke være lengre enn ${ABOUT_MAX_LENGTH} tegn`
            );
        }
        if (!isValid) {
            setShouldFocusErrorSummary(true);
        }
        return isValid;
    }

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleTelephoneChange(e) {
        setShouldFocusErrorSummary(false);
        setTelephoneValidationError(undefined);
        setTelephone(e.target.value);
    }

    function handleEmailChange(e) {
        setShouldFocusErrorSummary(false);
        setEmailValidationError(undefined);
        setEmail(e.target.value);
    }

    function handleAboutChange(e) {
        setShouldFocusErrorSummary(false);
        setAboutValidationError(undefined);
        setAbout(e.target.value);
    }

    function handleMustRequirementCheck(e) {
        const { checked, value } = e.target;
        if (checked) {
            setCheckedMustRequirements((prevState) => (prevState.includes(value) ? prevState : [...prevState, value]));
        } else {
            setCheckedMustRequirements((prevState) => prevState.filter((it) => it !== value));
        }
    }

    function handleShouldRequirementCheck(e) {
        const { checked, value } = e.target;
        if (checked) {
            setCheckedShouldRequirements((prevState) =>
                prevState.includes(value) ? prevState : [...prevState, value]
            );
        } else {
            setCheckedShouldRequirements((prevState) => prevState.filter((it) => it !== value));
        }
    }

    const getErrorMessage = (error) => {
        switch (error.message) {
            case "invalid_name":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at navnet ditt er skrevet riktig og prøv på nytt.";
            case "invalid_email":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at e-posten din er skrevet riktig og prøv på nytt. Eksempel: epost@mail.no";
            case "invalid_telephone":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at telefonnummeret ditt er skrevet riktig og prøv på nytt. Eksempel: +47 99 99 99 99";
            case "invalid_about":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at begrunnelsen din ikke inneholder noen lenker eller er lenger enn 400 tegn.";
            default:
                return "Det oppsto dessverre en feil og vi kunne ikke sende inn søknaden din. Prøv å send søknaden på nytt.";
        }
    };

    const errors = [];
    if (telephoneValidationError)
        errors.push(
            <ErrorSummary.Item href="#register-interest-telephone" key="1">
                {telephoneValidationError}
            </ErrorSummary.Item>
        );
    if (emailValidationError)
        errors.push(
            <ErrorSummary.Item href="#register-interest-email" key="2">
                {emailValidationError}
            </ErrorSummary.Item>
        );
    if (aboutValidationError)
        errors.push(
            <ErrorSummary.Item href="#register-interest-about" key="3">
                {aboutValidationError}
            </ErrorSummary.Item>
        );

    return (
        <form onSubmit={handleFormSubmit}>
            <section className="InterestForm__section">
                <H1WithAutoFocus className="InterestForm__h1">Superrask søknad</H1WithAutoFocus>
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

            {((interestForm.must && interestForm.must.length > 0) ||
                (interestForm.should && interestForm.should.length > 0)) && (
                <section className="InterestForm__section">
                    <Heading level="2" size="large" spacing>
                        Bedriftens ønskede kvalifikasjoner
                    </Heading>
                    <BodyLong className="mb-2">
                        Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                    </BodyLong>

                    {interestForm.must && interestForm.must.length > 0 && (
                        <fieldset className="InterestForm__fieldset">
                            <legend className="InterestForm__legend">Må-krav for stillingen.</legend>
                            <BodyLong>Kryss av for dem du oppfyller.</BodyLong>
                            {interestForm.must.map((it) => (
                                <Checkbox
                                    key={it.id}
                                    value={it.label}
                                    onChange={handleMustRequirementCheck}
                                    checked={checkedMustRequirements.includes(it.label)}
                                >
                                    {it.label}
                                </Checkbox>
                            ))}
                        </fieldset>
                    )}

                    {interestForm.should && interestForm.should.length > 0 && (
                        <fieldset className="InterestForm__fieldset">
                            <legend className="InterestForm__legend">Huk av for kvalifikasjonene du oppfyller</legend>
                            {interestForm.should.map((it) => (
                                <Checkbox
                                    key={it.id}
                                    value={it.label}
                                    onChange={handleShouldRequirementCheck}
                                    checked={checkedShouldRequirements.includes(it.label)}
                                >
                                    {it.label}
                                </Checkbox>
                            ))}
                        </fieldset>
                    )}
                </section>
            )}

            <section className="InterestForm__section">
                <Heading level="2" size="large">
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
                    id="register-interest-about"
                    label="Skriv en begrunnelse"
                    onChange={handleAboutChange}
                    value={about}
                    maxLength={ABOUT_MAX_LENGTH}
                    error={aboutValidationError}
                />
            </section>

            <section className="InterestForm__section">
                <Heading level="2" size="large" spacing>
                    Din kontaktinformasjon
                </Heading>
                <BodyLong className="mb-1">Vær nøye med å oppgi riktig informasjon.</BodyLong>

                <TextField
                    label="Navn"
                    id="register-interest-name"
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
                    id="register-interest-email"
                    onChange={handleEmailChange}
                    value={email}
                    error={emailValidationError}
                    className="mb-1"
                />

                <TextField
                    label="Telefonnummer *"
                    id="register-interest-telephone"
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
                <a target="_blank" rel="noopener noreferrer" href="/personvern-superrask-soknad">
                    Les om hvordan vi behandler dine data (åpner i ny fane)
                </a>
            </BodyLong>

            {hasError && <Alert>{getErrorMessage(error)}</Alert>}

            {isSending ? (
                <div aria-live="polite" className="InterestForm__progress">
                    <Loader size="small" /> Sender søknad
                </div>
            ) : (
                <div className="InterestForm__buttons">
                    <Button variant="primary" type="button" onClick={handleSendMessageClick}>
                        Send søknad
                    </Button>
                    <Button
                        variant="secondary"
                        as={Link}
                        to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${ad._id}`}
                    >
                        Avbryt
                    </Button>
                </div>
            )}
        </form>
    );
};

SuperraskSoknadForm.defaultProps = {};

SuperraskSoknadForm.propTypes = {};

export default SuperraskSoknadForm;

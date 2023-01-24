import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { captureException } from "@sentry/browser";
import { Link } from "react-router-dom";
import SearchAPI from "../../api/SearchAPI";
import InterestAPI from "../../api/InterestAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../hooks/useFetchReducer";
import useScrollToTop from "../../hooks/useScrollToTop";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import Alert from "../../components/alert/Alert";
import H1WithAutoFocus from "../../components/h1WithAutoFocus/H1WithAutoFocus";
import { Checkbox, Textarea } from "nav-frontend-skjema";
import { Hovedknapp } from "@navikt/arbeidsplassen-knapper";
import { isValidEmail } from "../../components/utils";
import "./InterestForm.less";
import getEmployer from "../../../server/common/getEmployer";
import { CONTEXT_PATH } from "../../environment";
import Spinner from "nav-frontend-spinner";
import TextField from "../../components/textField/TextField";
import BackLink from "../../components/backlink/BackLink";
import logAmplitudeEvent from "../../tracking/amplitude";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "./NotFound404";

const InterestForm = ({ match }) => {
    // Ad data
    const [{ data, status, error }, dispatch] = useFetchReducer();
    const [postInterestResponse, postInterestDispatch] = useFetchReducer();

    // Form data
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [about, setAbout] = useState("");
    const [checkedMustRequirements, setCheckedMustRequirements] = useState([]);
    const [checkedShouldRequirements, setCheckedShouldRequirements] = useState([]);

    // Validation
    const [telephoneValidationError, setTelephoneValidationError] = useState(undefined);
    const [emailValidationError, setEmailValidationError] = useState(undefined);
    const [aboutValidationError, setAboutValidationError] = useState(undefined);
    const errorSummary = useRef();

    const ABOUT_MAX_LENGTH = 400;

    useDocumentTitle("Meld interesse");
    useTrackPageview();
    useScrollToTop();

    const isInternal = match.path.startsWith("/stillinger/intern/");

    /**
     * Fetch ad and interest form
     */
    useEffect(() => {
        const id = match.params.uuid;
        const path = isInternal ? "intern" : "stilling";

        dispatch({ type: FetchAction.BEGIN });

        const promises = [SearchAPI.get(`api/${path}/${id}`), InterestAPI.getInterestForm(id)];

        Promise.all(promises)
            .then((responses) => {
                const [ad, interestForm] = responses;
                dispatch({ type: FetchAction.RESOLVE, data: { ad, interestForm } });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }, []);

    function handleFormSubmit(e) {
        e.preventDefault();
        return false
    }

    function handleSendMessageClick() {
        if (validateForm()) {
            postInterestDispatch({ type: FetchAction.BEGIN });
            InterestAPI.postInterest(match.params.uuid, {
                name,
                telephone: telephone,
                email,
                about,
                must: data.interestForm.must.map((it) => ({
                    ...it,
                    checked: checkedMustRequirements.includes(it.label)
                })),
                should: data.interestForm.should.map((it) => ({
                    ...it,
                    checked: checkedShouldRequirements.includes(it.label)
                })),
            })
                .then((data) => {
                    postInterestDispatch({ type: FetchAction.RESOLVE, data });
                })
                .catch((error) => {
                    captureException(error);
                    postInterestDispatch({ type: FetchAction.REJECT, error });
                });

            trackSendForm(data.ad);
        }
    }

    function validateForm() {
        let isValid = true;

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
            setAboutValidationError(`Du har brukt ${about.length - ABOUT_MAX_LENGTH} tegn for mye i din begrunnelse. Begrunnelsen kan ikke være lengre enn ${ABOUT_MAX_LENGTH} tegn`);
        }

        if (!isValid) {
            errorSummary.current.focus();
        }

        return isValid;
    }

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleTelephoneChange(e) {
        setTelephone(e.target.value);
        setTelephoneValidationError(undefined);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailValidationError(undefined);
    }

    function handleAboutChange(e) {
        setAbout(e.target.value);
        setAboutValidationError(undefined);
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
            setCheckedShouldRequirements((prevState) => (prevState.includes(value) ? prevState : [...prevState, value]));
        } else {
            setCheckedShouldRequirements((prevState) => prevState.filter((it) => it !== value));
        }
    }

    const trackSendForm = (ad) => {
        try {
            logAmplitudeEvent("submit superrask søknad", {
                id: ad._id
            });
        } catch (e) {
            // ignore
        }
    };

    const getErrorMessage = (error) => {
        switch (error.message) {
            case "invalid_name":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at navnet ditt er skrevet riktig og prøv på nytt."
            case "invalid_email":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at e-posten din er skrevet riktig og prøv på nytt. Eksempel: epost@mail.no"
            case "invalid_telephone":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at telefonnummeret ditt er skrevet riktig og prøv på nytt. Eksempel: +47 99 99 99 99"
            case "invalid_about":
                return "Vi kunne ikke sende inn søknaden din. Sjekk at begrunnelsen din ikke inneholder noen lenker eller er lenger enn 400 tegn."
            default:
                return "Det oppsto dessverre en feil og vi kunne ikke sende inn søknaden din. Prøv å send søknaden på nytt."
        }
    }

    return (
        <div className="InterestForm">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && error.statusCode !== 404 && (
                <div className="InterestForm__inner">
                    <Alert>Det oppsto dessverre en feil. Prøv å last inn siden på nytt.</Alert>
                </div>
            )}
            {status === FetchStatus.FAILURE && error.statusCode === 404 && (
               <NotFound404 />
            )}
            {status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <div className="InterestForm__green-box">
                        <div className="InterestForm__green-box-inner">
                            <p className="InterestForm__employer">{getEmployer(data.ad._source)}</p>
                            <p className="InterestForm__job-title">{data.ad._source.title}</p>
                        </div>
                    </div>
                    {postInterestResponse.status !== FetchStatus.SUCCESS && (
                        <div className="InterestForm__backlink">
                            <BackLink
                                to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                text="Tilbake"
                            />
                        </div>
                    )}
                    <div className="InterestForm__inner">
                        <div aria-live="polite">
                            {postInterestResponse.status === FetchStatus.SUCCESS && (
                                <ScrollToTop>
                                    <div className="InterestForm__success-message">
                                        <h1 className="InterestForm__h1">Din søknad er sendt til bedriften</h1>
                                        <p className="InterestForm__p InterestForm__mb-2">
                                            Du vil straks få en bekreftelse på din e-post {email}. Ønsker du å trekke
                                            din søknad finner du informasjon om dette i e-posten.
                                        </p>
                                        <h2 className="InterestForm__h2">Hva skjer nå?</h2>
                                        <p className="InterestForm__p InterestForm__mb-2">
                                            Bedriften vil vurdere din søknad og ta kontakt dersom de syns du passer for
                                            jobben. Du får beskjed på e-post så fort bedriften har gjort en vurdering.
                                        </p>
                                        <Link
                                            to={CONTEXT_PATH}
                                            className="Knapp"
                                        >
                                            Tilbake til stillingssøket
                                        </Link>
                                    </div>
                                </ScrollToTop>
                            )}
                        </div>

                        {postInterestResponse.status !== FetchStatus.SUCCESS && (
                            <form onSubmit={handleFormSubmit}>
                                <section className="InterestForm__section">
                                    <H1WithAutoFocus className="InterestForm__h1">Superrask søknad</H1WithAutoFocus>
                                    <p className="InterestForm__p">
                                        Ingen CV eller langt søknadsbrev, kun tre raske steg.
                                        Du får beskjed på e-post med en gang bedriften har vurdert søknaden din.
                                    </p>
                                    <p className="InterestForm__p">
                                        * felter du må fylle ut
                                    </p>
                                    <div
                                        ref={errorSummary}
                                        tabIndex={-1}
                                        aria-live="polite"
                                        aria-labelledby="register-interest-error-title"
                                    >
                                        {(telephoneValidationError || emailValidationError || aboutValidationError) && (
                                            <div className="InterestForm__error-summary">
                                                <h2
                                                    id="register-interest-error-title"
                                                    className="InterestForm__error-title"
                                                >
                                                    Skjemaet inneholder feil:
                                                </h2>
                                                <ul className="InterestForm__error-list">
                                                    {telephoneValidationError && (
                                                        <li>
                                                            <a href="#register-interest-telephone" className="link">
                                                                {telephoneValidationError}
                                                            </a>
                                                        </li>
                                                    )}
                                                    {emailValidationError && (
                                                        <li>
                                                            <a href="#register-interest-email" className="link">
                                                                {emailValidationError}
                                                            </a>
                                                        </li>
                                                    )}
                                                    {aboutValidationError && (
                                                        <li>
                                                            <a href="#register-interest-about" className="link">
                                                                {aboutValidationError}
                                                            </a>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {((data.interestForm.must && data.interestForm.must.length > 0)
                                    || (data.interestForm.should && data.interestForm.should.length > 0)) && (
                                    <section className="InterestForm__section">
                                        <h2 className="InterestForm__h2">Bedriftens ønskede kvalifikasjoner</h2>
                                        <p className="InterestForm__p InterestForm__mb-2">
                                            Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                                        </p>

                                        {data.interestForm.must && data.interestForm.must.length > 0 && (
                                            <fieldset className="InterestForm__fieldset">
                                                <legend className="InterestForm__legend">Må-krav for stillingen.</legend>
                                                <p className="InterestForm__p">Kryss av for dem du oppfyller.</p>
                                                {data.interestForm.must.map((it) => (
                                                    <Checkbox
                                                        key={it.id}
                                                        label={it.label}
                                                        value={it.label}
                                                        onChange={handleMustRequirementCheck}
                                                        checked={checkedMustRequirements.includes(it.label)}
                                                    />
                                                ))}
                                            </fieldset>
                                        )}

                                        {data.interestForm.should && data.interestForm.should.length > 0 && (
                                            <fieldset className="InterestForm__fieldset">
                                                <legend className="InterestForm__legend">
                                                    Huk av for kvalifikasjonene du oppfyller
                                                </legend>
                                                {data.interestForm.should.map((it) => (
                                                    <Checkbox
                                                        key={it.id}
                                                        label={it.label}
                                                        value={it.label}
                                                        onChange={handleShouldRequirementCheck}
                                                        checked={checkedShouldRequirements.includes(it.label)}
                                                    />
                                                ))}
                                            </fieldset>
                                        )}
                                    </section>
                                )}


                                <section className="InterestForm__section">
                                    <h2 className="InterestForm__h2">Hvorfor du er den rette for jobben</h2>
                                    <details className="InterestForm__details">
                                        <summary>
                                            Hvordan skrive en god begrunnelse?
                                        </summary>
                                        <div className="InterestForm__details-content">
                                            <p className="InterestForm__p">
                                                Vis hvorfor du er et trygt valg for denne jobben. Fortell om
                                                arbeidserfaring, praksisplasser, utdanning, frivillig arbeid,
                                                verv eller annen relevant erfaring.
                                            </p>
                                            <p className="InterestForm__p">
                                                Tenk gjerne litt utradisjonelt og husk at personlige
                                                egenskaper kan være avgjørende.
                                            </p>
                                        </div>
                                    </details>
                                    <Textarea
                                        id="register-interest-about"
                                        label="Skriv en begrunnelse"
                                        onChange={handleAboutChange}
                                        value={about}
                                        maxLength={ABOUT_MAX_LENGTH}
                                        feil={aboutValidationError ? { feilmelding: aboutValidationError } : undefined}
                                    />
                                </section>

                                <section className="InterestForm__section">
                                    <h2 className="InterestForm__h2">Din kontaktinformasjon</h2>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Vær nøye med å oppgi riktig informasjon.
                                    </p>

                                    <TextField
                                        label="Navn"
                                        id="register-interest-name"
                                        autoComplete="name"
                                        onChange={handleNameChange}
                                        value={name}
                                    />

                                    <TextField
                                        label="E-post *"
                                        type="email"
                                        autoComplete="email"
                                        id="register-interest-email"
                                        onChange={handleEmailChange}
                                        value={email}
                                        error={emailValidationError}
                                    />

                                    <TextField
                                        label="Telefonnummer *"
                                        id="register-interest-telephone"
                                        type="tel"
                                        autoComplete="tel"
                                        onChange={handleTelephoneChange}
                                        value={telephone}
                                        error={telephoneValidationError}
                                    />
                                </section>

                                <p className="InterestForm__p">
                                    Når du har sendt søknaden, kan bedriften se begrunnelsen din og hvilke
                                    kvalifikasjoner du har huket av, samt navnet ditt dersom du har oppgitt det.
                                    Hvis bedriften ønsker å kontakte deg, får de også se kontaktinformasjonen din.
                                </p>
                                <p className="InterestForm__p InterestForm__mb-2">
                                    Du kan når som helst trekke tilbake søknaden din.
                                </p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="/personvern-superrask-soknad"
                                    className="link"
                                >
                                    Les om hvordan vi behandler dine data (åpner i ny fane)
                                </a>

                                {postInterestResponse.status === FetchStatus.FAILURE && (
                                    <Alert>
                                        {getErrorMessage(postInterestResponse.error)}
                                    </Alert>
                                )}

                                {postInterestResponse.status === FetchStatus.IS_FETCHING ? (
                                    <div aria-live="polite" className="InterestForm__progress">
                                        <Spinner type="S" /> Sender søknad
                                    </div>
                                ) : (
                                    <div className="InterestForm__buttons">
                                        <Hovedknapp htmlType="button" onClick={handleSendMessageClick}>Send søknad</Hovedknapp>
                                        <Link
                                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                            className="Knapp"
                                        >
                                            Avbryt
                                        </Link>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

InterestForm.defaultProps = {
    match: { params: {} }
};

InterestForm.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    })
};

export default InterestForm;

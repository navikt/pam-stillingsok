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
    const [nameValidationError, setNameValidationError] = useState(undefined);
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

        if (name.trim().length === 0) {
            isValid = false;
            setNameValidationError("Navn mangler");
        }

        if (email && email.length > 0 && !isValidEmail(email)) {
            isValid = false;
            setEmailValidationError("E-postadressen er ugyldig");
        } else if (email === undefined || email.trim().length === 0) {
            isValid = false;
            setEmailValidationError("E-post mangler");
        }

        if (telephone.trim().length === 0) {
            isValid = false;
            setTelephoneValidationError("Telefonnummer mangler");
        }

        if (about.length > ABOUT_MAX_LENGTH) {
            isValid = false;
            setAboutValidationError(`Begrunnelse kan ikke være lengre enn ${ABOUT_MAX_LENGTH} tegn`);
        }

        if (!isValid) {
            errorSummary.current.focus();
        }

        return isValid;
    }

    function handleNameChange(e) {
        setName(e.target.value);
        setNameValidationError(undefined);
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
            logAmplitudeEvent("Stilling sok-via-interesseskjema", {
                id: ad._id
            });
        } catch (e) {
            // ignore
        }
    };

    return (
        <div className="InterestForm">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && error.statusCode !== "404" && (
                <div className="InterestForm__inner">
                    <Alert>Det oppsto en feil. Forsøk å laste inn siden på nytt</Alert>
                </div>
            )}
            {status === FetchStatus.FAILURE && error.statusCode === "404" && (
                <div className="InterestForm__inner">
                    <Alert>
                        Fant ikke innholdet du ser etter. Det kan være en feil i lenken du brukte,
                        eller det kan være at arbeidsgiver har avsluttet søknadsprosessen.
                    </Alert>
                </div>
            )}
            {status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <div className="InterestForm__green-box">
                        <div className="InterestForm__green-box-inner">
                            <p className="InterestForm__employer">{getEmployer(data.ad._source)}</p>
                            <p className="InterestForm__job-title">{data.ad._source.title}</p>
                        </div>
                    </div>
                    <div className="InterestForm__backlink">
                        <BackLink
                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                            text="Tilbake"
                        />
                    </div>
                    <div className="InterestForm__inner">
                        <div className="InterestForm__success-message" aria-live="polite">
                            {postInterestResponse.status === FetchStatus.SUCCESS && (
                                <div className="InterestForm__success-message" aria-live="polite">
                                    <h1 className="InterestForm__h1">Din søknad er sendt til bedriften</h1>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Du vil straks få en bekreftelse på e-post. Ønsker du å trekke din
                                        søknad finner du informasjon om det i e-posten.
                                    </p>
                                    <h2 className="InterestForm__h2">Hva skjer nå?</h2>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Bedriften vil vurdere din søknad og ta kontakt dersom de syns det er en god match.
                                        Vi gir deg beskjed på e-post så fort bedriften har gjort en vurdering.                                    </p>
                                    <Link
                                        to={CONTEXT_PATH}
                                        className="Knapp"
                                    >
                                        Gå til stillingsøket
                                    </Link>
                                </div>
                            )}
                        </div>

                        {postInterestResponse.status !== FetchStatus.SUCCESS && (
                            <form onSubmit={handleFormSubmit}>
                                <section className="InterestForm__section">
                                    <H1WithAutoFocus className="InterestForm__h1">Superrask søknad</H1WithAutoFocus>
                                    <p className="InterestForm__p">
                                        Ingen CV eller langt søknadsbrev, kun hvorfor du er rett person for denne jobben.
                                        Vi gir beskjed på e-post med en gang bedriften har gjort en vurdering.
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
                                        {(nameValidationError || telephoneValidationError || emailValidationError || aboutValidationError) && (
                                            <div className="InterestForm__error-summary">
                                                <h2
                                                    id="register-interest-error-title"
                                                    className="InterestForm__error-title"
                                                >
                                                    Skjemaet inneholder feil:
                                                </h2>
                                                <ul className="InterestForm__error-list">
                                                    {nameValidationError && (
                                                        <li>
                                                            <a href="#register-interest-name" className="link">
                                                                {nameValidationError}
                                                            </a>
                                                        </li>
                                                    )}
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
                                        <h2 className="InterestForm__h2">Vis frem din erfaring</h2>
                                        <p className="InterestForm__p InterestForm__mb-2">
                                            Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                                        </p>

                                        {data.interestForm.must && data.interestForm.must.length > 0 && (
                                            <fieldset className="InterestForm__fieldset">
                                                <legend className="InterestForm__legend">Må-krav for stillingen.</legend>
                                                <p className="InterestForm__p">Kryss av for de du oppfyller.</p>
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
                                                    Bedriftens ønskede kvalifikasjoner
                                                </legend>
                                                <p className="InterestForm__p">Kryss av for de du oppfyller.</p>
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
                                    <h2 className="InterestForm__h2">Skriv litt om hvorfor du er rett person</h2>
                                    <p className="InterestForm__p">
                                        Skriv en begrunnelse hvorfor akkurat du passer for denne jobben.
                                    </p>
                                    <Textarea
                                        id="register-interest-about"
                                        label="Skriv en begrunnelse. Valgfritt"
                                        onChange={handleAboutChange}
                                        value={about}
                                        maxLength={ABOUT_MAX_LENGTH}
                                        feil={aboutValidationError ? { feilmelding: aboutValidationError } : undefined}
                                    />
                                </section>

                                <section className="InterestForm__section">
                                    <h2 className="InterestForm__h2">Fyll inn din kontaktinformasjon</h2>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Husk å dobbelsjekk at informasjonen er riktig.
                                    </p>

                                    <TextField
                                        label="Navn *"
                                        id="register-interest-name"
                                        autoComplete="name"
                                        onChange={handleNameChange}
                                        value={name}
                                        error={nameValidationError}
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
                                    Når du har sendt din søknad vil bedriften kunne se dine kvalifikasjoner,
                                    begrunnelse og navn. Dersom de ønsker kontakte deg vil de få tilgang til
                                    telefonnummer og e-post.
                                </p>
                                <p className="InterestForm__p InterestForm__mb-2">
                                    Du kan når som helst trekke tilbake din søknad.
                                </p>

                                {postInterestResponse.status === FetchStatus.FAILURE && (
                                    <Alert>Det oppsto en feil ved sending. Forsøk igjen</Alert>
                                )}

                                {postInterestResponse.status === FetchStatus.IS_FETCHING ? (
                                    <div aria-live="polite" className="InterestForm__progress">
                                        <Spinner type="S" /> Sender søknad
                                    </div>
                                ) : (
                                    <div className="InterestForm__buttons">
                                        <Link
                                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                            className="Knapp"
                                        >
                                            Avbryt
                                        </Link>
                                        <Hovedknapp htmlType="button" onClick={handleSendMessageClick}>Send søknad</Hovedknapp>
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

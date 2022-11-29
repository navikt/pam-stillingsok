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

const InterestForm = ({ match }) => {
    // Ad data
    const [{ data, status }, dispatch] = useFetchReducer();
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

    const ABOUT_MAX_LENGTH = 300;

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
            setAboutValidationError(`Melding til bedrift kan ikke være lengre enn ${ABOUT_MAX_LENGTH} tegn`);
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

    return (
        <div className="InterestForm">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && (
                <div className="InterestForm__inner">
                    <Alert>Det oppsto en feil. Forsøk å laste inn siden på nytt</Alert>
                </div>
            )}
            {status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <div className="InterestForm__green-box">
                        <div className="InterestForm__inner">
                            <p className="InterestForm__employer">{getEmployer(data.ad._source)}</p>
                            <p className="InterestForm__job-title">{data.ad._source.title}</p>
                        </div>
                    </div>
                    <div className="InterestForm__inner">
                        <BackLink
                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                            text="Tilbake til annonsen"
                        />

                        <div className="InterestForm__success-message" aria-live="polite">
                            {postInterestResponse.status === FetchStatus.SUCCESS && (
                                <div className="InterestForm__success-message" aria-live="polite">
                                    <h1 className="InterestForm__h1">Din interessemelding er registrert</h1>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Du vil få tilsendt en bekreftelse på e-post.
                                    </p>
                                    <Link
                                        to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                        className="Knapp Knapp--hoved"
                                    >
                                        Tilbake til stillingsannonsen
                                    </Link>
                                </div>
                            )}
                        </div>

                        {postInterestResponse.status !== FetchStatus.SUCCESS && (
                            <form onSubmit={handleFormSubmit}>
                                <H1WithAutoFocus className="InterestForm__h1">Meld din interesse</H1WithAutoFocus>
                                <p className="InterestForm__lead">
                                    Gi beskjed til bedriften at du ønsker å bli kontaktet for denne stillingen.{" "}
                                </p>
                                <div
                                    ref={errorSummary}
                                    tabIndex={-1}
                                    aria-live="polite"
                                    aria-labelledby="register-interest-error-title"
                                >
                                    {(telephoneValidationError || emailValidationError) && (
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

                                <section className="InterestForm__section">
                                    <h2 className="InterestForm__h2">Fyll inn din kontaktinformasjon</h2>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Kontaktinformasjonen blir tilgjengelig for arbeidsgiver hvis de ønsker å ta
                                        kontakt.
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
                                        label="Telefonnummer *"
                                        id="register-interest-telephone"
                                        type="tel"
                                        autoComplete="tel"
                                        onChange={handleTelephoneChange}
                                        value={telephone}
                                        error={telephoneValidationError}
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
                                </section>

                                <section className="InterestForm__section">
                                    <h2 className="InterestForm__h2">Vis frem din erfaring</h2>
                                    <p className="InterestForm__p InterestForm__mb-2">
                                        Her ser du hva bedriften legger vekt på i stillingen.
                                    </p>

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

                                    <fieldset className="InterestForm__fieldset">
                                        <legend className="InterestForm__legend">
                                            Relevant og ønsket erfaring for stillingen.
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
                                </section>

                                <section className="InterestForm__section">
                                    <h2 className="InterestForm__h2">Skriv en melding til bedriften</h2>
                                    <p className="InterestForm__p">
                                        Forklar kort hvorfor du er rett person for jobben eller utdyb noen av svarene
                                        dine til bedriften.
                                    </p>
                                    <Textarea
                                        id="register-interest-about"
                                        label="Melding til bedrift. Frivillig."
                                        onChange={handleAboutChange}
                                        value={about}
                                        maxLength={ABOUT_MAX_LENGTH}
                                        feil={aboutValidationError ? { feilmelding: aboutValidationError } : undefined}
                                    />
                                </section>
                                <p className="InterestForm__p">
                                    Bedriften vil få tilgang til informasjonen du har oppgitt. Hvis de ønsker å ta
                                    kontakt vil de få tilgang til din kontaktinformasjon.
                                </p>
                                <p className="InterestForm__p InterestForm__mb-2">
                                    Du kan når som helst trekke tilbake denne tilgangen.
                                </p>

                                {postInterestResponse.status === FetchStatus.FAILURE && (
                                    <Alert>Det oppsto en feil ved sending. Forsøk igjen</Alert>
                                )}

                                {postInterestResponse.status === FetchStatus.IS_FETCHING ? (
                                    <div aria-live="polite" className="InterestForm__progress">
                                        <Spinner type="S" /> Sender interessemelding
                                    </div>
                                ) : (
                                    <div className="InterestForm__buttons">
                                        <Link
                                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                            className="Knapp"
                                        >
                                            Avbryt
                                        </Link>
                                        <Hovedknapp htmlType="button" onClick={handleSendMessageClick}>Send melding</Hovedknapp>
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

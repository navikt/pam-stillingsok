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
import { Checkbox } from "nav-frontend-skjema";
import Button from "../../components/Button/Button";
import { isValidEmail } from "../../components/utils";
import "./RegisterInterest.less";
import getEmployer from "../../../server/common/getEmployer";
import { CONTEXT_PATH } from "../../environment";
import Spinner from "nav-frontend-spinner";
import TextField from "../../components/textField/TextField";
import BackLink from "../../components/backlink/BackLink";

const RegisterInterest = ({ match }) => {
    // Ad data
    const [{ data, status }, dispatch] = useFetchReducer();
    const [postInterestResponse, postInterestDispatch] = useFetchReducer();

    // Form data
    const [telephoneNumber, setTelephoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [checkedHardRequirements, setCheckedHardRequirements] = useState([]);
    const [checkedSoftRequirements, setCheckedSoftRequirements] = useState([]);

    // Validation
    const [telephoneNumberValidationError, setTelephoneNumberValidationError] = useState(undefined);
    const [emailValidationError, setEmailValidationError] = useState(undefined);
    const errorSummary = useRef();

    useDocumentTitle("Meld interesse");
    useTrackPageview();
    useScrollToTop();

    const isInternal = match.path.startsWith("/stillinger/intern/");

    /**
     * Fetch ad and requirements
     */
    useEffect(() => {
        const id = match.params.uuid;
        const path = isInternal ? "intern" : "stilling";

        dispatch({ type: FetchAction.BEGIN });

        const promises = [SearchAPI.get(`api/${path}/${id}`), InterestAPI.getRequirements(id)];

        Promise.all(promises)
            .then((responses) => {
                const [ad, requirements] = responses;
                dispatch({ type: FetchAction.RESOLVE, data: { ad, requirements } });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }, []);

    function handleFormSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            postInterestDispatch({ type: FetchAction.BEGIN });
            InterestAPI.postInterest()
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

        if (email && email.length > 0 && !isValidEmail(email)) {
            isValid = false;
            setEmailValidationError("E-postadressen er ugyldig");
        } else if (email === undefined || email.trim().length === 0) {
            isValid = false;
            setEmailValidationError("E-post mangler");
        }

        if (telephoneNumber.trim().length === 0) {
            isValid = false;
            setTelephoneNumberValidationError("Telefonnummer mangler");
        }

        if (!isValid) {
            errorSummary.current.focus();
        }

        return isValid;
    }

    function handleTelephoneNumberChange(e) {
        setTelephoneNumber(e.target.value);
        setTelephoneNumberValidationError(undefined);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailValidationError(undefined);
    }

    function handleHardRequirementCheck(e) {
        const { checked, value } = e.target;
        if (checked) {
            setCheckedHardRequirements((prevState) => (prevState.includes(value) ? prevState : [...prevState, value]));
        } else {
            setCheckedHardRequirements((prevState) => prevState.filter((it) => it !== value));
        }
    }

    function handleSoftRequirementCheck(e) {
        const { checked, value } = e.target;
        if (checked) {
            setCheckedSoftRequirements((prevState) => (prevState.includes(value) ? prevState : [...prevState, value]));
        } else {
            setCheckedSoftRequirements((prevState) => prevState.filter((it) => it !== value));
        }
    }

    return (
        <div className="RegisterInterest">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && (
                <div className="RegisterInterest__inner">
                    <Alert>Det oppsto en feil. Forsøk å laste inn siden på nytt</Alert>
                </div>
            )}
            {status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <div className="RegisterInterest__green-box">
                        <div className="RegisterInterest__inner">
                            <p className="RegisterInterest__employer">{getEmployer(data.ad._source)}</p>
                            <p className="RegisterInterest__job-title">{data.ad._source.title}</p>
                        </div>
                    </div>
                    <div className="RegisterInterest__inner">
                        <BackLink
                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                            text="Tilbake til annonsen"
                        />
                        {postInterestResponse.status === FetchStatus.SUCCESS ? (
                            <div className="RegisterInterest__success-message">
                                <h1 className="RegisterInterest__h1">Din interessemelding er registrert</h1>
                                <p className="RegisterInterest__p RegisterInterest__mb-2">
                                    Du vil få tilsendt en bekreftelse på e-post.
                                </p>
                                <Link
                                    to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                    className="Button Button--primary"
                                >
                                    Tilbake til stillingsannonsen
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit}>
                                <H1WithAutoFocus className="RegisterInterest__h1">Meld din interesse</H1WithAutoFocus>
                                <p className="RegisterInterest__lead">
                                    Gi beskjed til bedriften at du ønsker å bli kontaktet angående denne stillingen.
                                </p>

                                <div
                                    ref={errorSummary}
                                    tabIndex={-1}
                                    aria-live="polite"
                                    aria-labelledby="register-interest-error-title"
                                >
                                    {(telephoneNumberValidationError || emailValidationError) && (
                                        <div className="RegisterInterest__error-summary">
                                            <h2
                                                id="register-interest-error-title"
                                                className="RegisterInterest__error-title"
                                            >
                                                Skjemaet inneholder feil:
                                            </h2>
                                            <ul className="RegisterInterest__error-list">
                                                {telephoneNumberValidationError && (
                                                    <li>
                                                        <a href="#register-interest-telephone" className="link">
                                                            {telephoneNumberValidationError}
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
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <section className="RegisterInterest__section">
                                    <h2 className="RegisterInterest__h2">Fyll inn din kontaktinformasjon</h2>
                                    <p className="RegisterInterest__p RegisterInterest__mb-2">
                                        Kontaktinformasjonen blir tilgjengelig for arbeidsgiver hvis de ønsker å ta
                                        kontakt.
                                    </p>

                                    <TextField
                                        label="Telefonnummer *"
                                        id="register-interest-telephone"
                                        type="tel"
                                        autoComplete="tel"
                                        onChange={handleTelephoneNumberChange}
                                        value={telephoneNumber}
                                        error={telephoneNumberValidationError}
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

                                <section className="RegisterInterest__section">
                                    <h2 className="RegisterInterest__h2">Vis frem din erfaring for bedriften</h2>
                                    <p className="RegisterInterest__p RegisterInterest__mb-2">
                                        Her ser du hvilke kompetanser bedriften legger vekt på i stillingen.
                                    </p>

                                    <fieldset className="RegisterInterest__fieldset">
                                        <legend className="RegisterInterest__legend">
                                            Bedriftens krav til stillingen. Kryss av for de du oppfyller.
                                        </legend>
                                        {data.requirements.hardRequirements.map((it) => (
                                            <Checkbox
                                                key={it.label}
                                                name={it.label}
                                                label={it.label}
                                                value={it.label}
                                                onChange={handleHardRequirementCheck}
                                                checked={checkedHardRequirements.includes(it.label)}
                                            />
                                        ))}
                                    </fieldset>

                                    <fieldset className="RegisterInterest__fieldset">
                                        <legend className="RegisterInterest__legend">
                                            Bedriftens ønskede kompetanser til stillingen. Kryss av for de du oppfyller.
                                        </legend>
                                        {data.requirements.softRequirements.map((it) => (
                                            <Checkbox
                                                key={it.label}
                                                name={it.label}
                                                label={it.label}
                                                value={it.label}
                                                onChange={handleSoftRequirementCheck}
                                                checked={checkedSoftRequirements.includes(it.label)}
                                            />
                                        ))}
                                    </fieldset>
                                </section>
                                <p className="RegisterInterest__p">
                                    Bedriften vil få tilgang til de kompetanser du har oppgitt. Hvis de ønsker å ta
                                    kontakt får de tilgang til kontaktinformasjonen du har oppgitt.
                                </p>
                                <p className="RegisterInterest__p RegisterInterest__mb-2">
                                    Du kan når som helst trekke tilbake denne tilgangen.
                                </p>

                                {postInterestResponse.status === FetchStatus.FAILURE && (
                                    <Alert>Det oppsto en feil ved sending. Forsøk igjen</Alert>
                                )}

                                {postInterestResponse.status === FetchStatus.IS_FETCHING ? (
                                    <div aria-live="polite" className="RegisterInterest__progress">
                                        <Spinner type="S" /> Sender interessemelding
                                    </div>
                                ) : (
                                    <div className="RegisterInterest__buttons">
                                        <Link
                                            to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                            className="Button Button--secondary"
                                        >
                                            Avbryt
                                        </Link>
                                        <Button variant="primary" htmlType="submit">
                                            Send melding
                                        </Button>
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

RegisterInterest.defaultProps = {
    match: { params: {} }
};

RegisterInterest.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    })
};

export default RegisterInterest;

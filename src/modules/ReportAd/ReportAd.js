import * as React from "react";
import { useContext, useEffect, useState } from "react";
import "./ReportAd.css";
import { CONTEXT_PATH } from "../../environment";
import { captureException } from "@sentry/browser";
import logAmplitudeEvent from "../../tracking/amplitude";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { AuthenticationContext, AuthenticationStatus } from "../Authentication/AuthenticationProvider";
import UserAPI from "../../api/UserAPI";
import BackLink from "../../components/BackLink/BackLink";
import useScrollToTop from "../../hooks/useScrollToTop";
import H1WithAutoFocus from "../../components/H1WithAutoFocus/H1WithAutoFocus";
import { Alert, Checkbox, Textarea } from "@navikt/ds-react";
import Button from "../../components/Button/Button";

const violationCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Annet", key: "other" }
];

const scamCategories = [
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" }
];

const ReportAd = () => {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const [error, setError] = useState(false);
    const [finished, setFinished] = useState(false);
    const [stillingId, setStillingId] = useState(null);
    const [violation, setViolation] = useState(false);
    const [violationCategory, setViolationCategory] = useState(null);
    const [scam, setScam] = useState(false);
    const [scamCategory, setScamCategory] = useState(null);
    const [description, setDescription] = useState("");
    const [descriptionLabel, setDescriptionLabel] = useState("Beskrivelse - må fylles ut");

    useDocumentTitle("Rapportér annonse");
    useScrollToTop();

    useEffect(() => {
        if (document.location.search.includes("uuid")) {
            setStillingId(document.location.search.split("=")[1]);
        }
    }, []);

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleViolationCheck() {
        setViolation(!violation);
        setScam(false);
        setViolationCategory(null);
        setScamCategory(null);
        setDescriptionLabel("Beskriv regelbruddet - må fylles ut");
    }

    function handleViolationCategoryCheck(e) {
        setViolationCategory(e.target.value);
    }

    function handleScamCheck() {
        setScam(!scam);
        setViolation(false);
        setViolationCategory(null);
        setScamCategory(null);
        setDescriptionLabel("Beskriv svindelen - må fylles ut");
    }

    function handleScamCategoryCheck(e) {
        setScamCategory(e.target.value);
    }

    async function handleSendTip() {
        const category = violation ? "Regelbrudd" : "Mistanke om svindel";
        const subCategory = violation
            ? violationCategories.filter((c) => c.key === violationCategory)[0].label
            : scamCategories.filter((c) => c.key === scamCategory)[0].label;
        const title = "En stilling har blitt rapportert for " + category.toLowerCase();

        try {
            await UserAPI.post(
                "api/v1/reportposting",
                {
                    category,
                    subCategory,
                    title,
                    postingId: stillingId,
                    description
                },
                false
            );

            setFinished(true);

            logAmplitudeEvent("Rapportering av stillingsannonse", {
                category,
                subCategory,
                title,
                postingId: stillingId,
                description
            });
        } catch (e) {
            captureException(e);
            setError(true);
        }
    }

    return (
        <div className="RapporterAnnonse">
            <BackLink to={`${CONTEXT_PATH}/stilling/${stillingId}`} text="Tilbake til annonsen" />

            {authenticationStatus !== AuthenticationStatus.IS_AUTHENTICATED && (
                <div>
                    <h2>Du må logge inn</h2>
                    <p>Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.</p>
                    <Button variant="primary" onClick={login}>
                        Logg inn
                    </Button>
                </div>
            )}

            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                <div>
                    {finished && (
                        <div>
                            <H1WithAutoFocus>Takk for din tilbakemelding</H1WithAutoFocus>

                            <div className="report-form">
                                <p>Takk for at du tok deg tid til å rapportere denne annonsen.</p>
                                <br />
                                <p>
                                    Har du spørsmål kan du <a href="/kontakt">kontakte oss her.</a>
                                </p>
                                <br />
                                <p>
                                    Med vennlig hilsen,
                                    <br />
                                    Arbeidsplassen
                                </p>
                            </div>

                            <div className="shape-container">
                                <div className="diamond" />
                                <div className="circle" />
                            </div>
                        </div>
                    )}
                    {!finished && (
                        <div>
                            <H1WithAutoFocus>Rapportér annonse</H1WithAutoFocus>

                            <div className="report-form">
                                <h2>Henveldensen gjelder</h2>

                                <Checkbox
                                    name="regelbrudd"
                                    onChange={handleViolationCheck}
                                    checked={violation === true}
                                >
                                    Regelbrudd
                                </Checkbox>

                                {violation &&
                                    violationCategories.map((c) => {
                                        return (
                                            <Checkbox
                                                className="sub-checkbox"
                                                key={c.key}
                                                value={c.key}
                                                onChange={handleViolationCategoryCheck}
                                                checked={violationCategory === c.key}
                                            >
                                                {c.label}
                                            </Checkbox>
                                        );
                                    })}

                                <Checkbox name="svindel" onChange={handleScamCheck} checked={scam === true}>
                                    Mistanke om svindel
                                </Checkbox>

                                {scam &&
                                    scamCategories.map((c) => {
                                        return (
                                            <Checkbox
                                                className="sub-checkbox"
                                                key={c.key}
                                                value={c.key}
                                                onChange={handleScamCategoryCheck}
                                                checked={scamCategory === c.key}
                                            >
                                                {c.label}
                                            </Checkbox>
                                        );
                                    })}

                                <br />

                                <Textarea
                                    label={descriptionLabel}
                                    maxLength={255}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    description="Legg ikke igjen personopplysinger i dette feltet"
                                />

                                <p>
                                    <a href="/retningslinjer-stillingsannonser" className="link">
                                        Les om gjeldende regler
                                    </a>
                                </p>
                            </div>

                            {error && (
                                <Alert role="alert" variant="error" className="mb-1">
                                    Rapportering feilet - prøv igjen
                                </Alert>
                            )}

                            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                                <Button
                                    variant="primary"
                                    disabled={(violationCategory === null && scamCategory === null) || !description}
                                    onClick={handleSendTip}
                                >
                                    Send tips
                                </Button>
                            )}
                        </div>
                    )}

                    <p className="disclaimer">
                        Stillingsannonser blir som regel umiddelbart publisert på Arbeidsplassen.no. Etter publisering
                        vil alle annonser bli kontrollert etter NAVs retningslinjer. I tilfeller der det er brudd på
                        retningslinjene vil stillingsannonsene bli fjernet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReportAd;

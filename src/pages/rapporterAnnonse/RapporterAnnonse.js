import * as React from "react";
import { useContext, useEffect, useState } from "react";
import Container from "nav-frontend-grid/lib/container";
import Sidetittel from "nav-frontend-typografi/lib/sidetittel";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import "./RapporterAnnonse.less";
import Checkbox from "nav-frontend-skjema/lib/checkbox";
import { Hovedknapp, Lenkeknapp } from "@navikt/arbeidsplassen-knapper";
import { CONTEXT_PATH } from "../../environment";
import Chevron from "nav-frontend-chevron";
import { Link } from "react-router-dom";
import AlertStripeFeil from "nav-frontend-alertstriper/lib/feil-alertstripe";
import logAmplitudeEvent from "../../utils/amplitudeTracker";
import { Textarea } from "nav-frontend-skjema";
import { useDocumentTitle } from "../../hooks";
import { AuthenticationContext, AuthenticationStatus } from "../../context/AuthenticationProvider";
import { adUserApiPost } from "../../api/adUserApi";

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

const RapporterAnnonse = () => {
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

    useDocumentTitle("Rapportér annonse - Arbeidsplassen");

    useEffect(() => {
        if (document.location.search.includes("uuid")) {
            setStillingId(document.location.search.split("=")[1]);
        }
    }, []);

    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const onViolationCheck = () => {
        setViolation(!violation);
        setScam(false);
        setViolationCategory(null);
        setScamCategory(null);
        setDescriptionLabel("Beskriv regelbruddet - må fylles ut");
    };

    const onViolationCategoryCheck = (e) => {
        setViolationCategory(e.target.value);
    };

    const onScamCheck = () => {
        setScam(!scam);
        setViolation(false);
        setViolationCategory(null);
        setScamCategory(null);
        setDescriptionLabel("Beskriv svindelen - må fylles ut");
    };

    const onScamCategoryCheck = (e) => {
        setScamCategory(e.target.value);
    };

    const onSendTip = async () => {
        const category = violation ? "Regelbrudd" : "Mistanke om svindel";
        const subCategory = violation
            ? violationCategories.filter((c) => c.key === violationCategory)[0].label
            : scamCategories.filter((c) => c.key === scamCategory)[0].label;
        const title = "En stilling har blitt rapportert for " + category.toLowerCase();

        try {
            await adUserApiPost(
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
            setError(true);
        }
    };

    return (
        <Container className="RapporterAnnonse">
            {error && (
                <AlertStripeFeil className="alertstripe--solid infoboks">
                    Rapportering feilet - prøv igjen
                </AlertStripeFeil>
            )}

            <br />
            <Link to={CONTEXT_PATH + "/stilling/" + stillingId} className="BackLink no-print">
                <Chevron type="venstre" className="BackLink__chevron" />
                <span className="BackLink__label">Tilbake til annonsen</span>
            </Link>

            {authenticationStatus !== AuthenticationStatus.IS_AUTHENTICATED && (
                <div>
                    <h2>Du må logge inn</h2>
                    <p>Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.</p>
                    <Hovedknapp onClick={login}>Logg inn</Hovedknapp>
                </div>
            )}

            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                <div>
                    {finished && (
                        <div>
                            <Sidetittel>Takk for din tilbakemelding</Sidetittel>

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
                            <Sidetittel>Rapportér annonse</Sidetittel>

                            <div className="report-form">
                                <Undertittel>Henveldensen gjelder</Undertittel>

                                <Checkbox
                                    name="regelbrudd"
                                    label="Regelbrudd"
                                    onChange={onViolationCheck}
                                    checked={violation === true}
                                />

                                {violation &&
                                    violationCategories.map((c) => {
                                        return (
                                            <Checkbox
                                                className="sub-checkbox"
                                                key={c.key}
                                                label={c.label}
                                                value={c.key}
                                                onChange={onViolationCategoryCheck}
                                                checked={violationCategory === c.key}
                                            />
                                        );
                                    })}

                                <Checkbox
                                    label="Mistanke om svindel"
                                    name="svindel"
                                    onChange={onScamCheck}
                                    checked={scam === true}
                                />

                                {scam &&
                                    scamCategories.map((c) => {
                                        return (
                                            <Checkbox
                                                className="sub-checkbox"
                                                key={c.key}
                                                label={c.label}
                                                value={c.key}
                                                onChange={onScamCategoryCheck}
                                                checked={scamCategory === c.key}
                                            />
                                        );
                                    })}

                                <br />

                                <Textarea
                                    label={descriptionLabel}
                                    maxLength={255}
                                    value={description}
                                    onChange={onDescriptionChange}
                                    tellerTekst={() => {
                                        return "Legg ikke igjen personopplysinger i dette feltet";
                                    }}
                                />

                                <Lenkeknapp onClick={() => (window.location.href = "/retningslinjer")}>
                                    Les om gjeldende regler
                                </Lenkeknapp>
                            </div>

                            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                                <Hovedknapp
                                    disabled={(violationCategory === null && scamCategory === null) || !description}
                                    onClick={onSendTip}
                                >
                                    Send tips
                                </Hovedknapp>
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
        </Container>
    );
};

export default RapporterAnnonse;

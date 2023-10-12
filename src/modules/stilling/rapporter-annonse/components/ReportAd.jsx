import * as React from "react";
import { useContext, useEffect, useState } from "react";
import "./ReportAd.css";
import { Alert, BodyLong, Button, Checkbox, Heading, Textarea, Link as AkselLink } from "@navikt/ds-react";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import { AuthenticationContext, AuthenticationStatus } from "../../../common/auth/contexts/AuthenticationProvider";
import UserAPI from "../../../common/api/UserAPI";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";

const violationCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Annet", key: "other" },
];

const scamCategories = [
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" },
];

function ReportAd() {
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
        const title = `En stilling har blitt rapportert for ${category.toLowerCase()}`;

        try {
            await UserAPI.post(
                "api/v1/reportposting",
                {
                    category,
                    subCategory,
                    title,
                    postingId: stillingId,
                    description,
                },
                false,
            );

            setFinished(true);

            logAmplitudeEvent("Rapportering av stillingsannonse", {
                category,
                subCategory,
                title,
                postingId: stillingId,
                description,
            });
        } catch (e) {
            setError(true);
        }
    }

    return (
        <div className="container-medium mt-12 mb-16">
            {authenticationStatus !== AuthenticationStatus.IS_AUTHENTICATED && (
                <div>
                    <Heading level="2" size="large" spacing>
                        Du må logge inn
                    </Heading>
                    <BodyLong className="mb-8">
                        Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
                    </BodyLong>
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
                                <BodyLong spacing>Takk for at du tok deg tid til å rapportere denne annonsen.</BodyLong>
                                <BodyLong spacing>
                                    Har du spørsmål kan du <AkselLink href="/kontakt">kontakte oss her.</AkselLink>
                                </BodyLong>
                                <BodyLong>Med vennlig hilsen arbeidsplassen.no</BodyLong>
                            </div>
                        </div>
                    )}
                    {!finished && (
                        <div>
                            <H1WithAutoFocus>Rapporter annonse</H1WithAutoFocus>

                            <div className="report-form">
                                <Heading level="2" size="small" spacing>
                                    Henveldensen gjelder
                                </Heading>

                                <Checkbox
                                    name="regelbrudd"
                                    onChange={handleViolationCheck}
                                    checked={violation === true}
                                >
                                    Regelbrudd
                                </Checkbox>

                                {violation &&
                                    violationCategories.map((c) => (
                                        <Checkbox
                                            className="sub-checkbox"
                                            key={c.key}
                                            value={c.key}
                                            onChange={handleViolationCategoryCheck}
                                            checked={violationCategory === c.key}
                                        >
                                            {c.label}
                                        </Checkbox>
                                    ))}

                                <Checkbox name="svindel" onChange={handleScamCheck} checked={scam === true}>
                                    Mistanke om svindel
                                </Checkbox>

                                {scam &&
                                    scamCategories.map((c) => (
                                        <Checkbox
                                            className="sub-checkbox"
                                            key={c.key}
                                            value={c.key}
                                            onChange={handleScamCategoryCheck}
                                            checked={scamCategory === c.key}
                                        >
                                            {c.label}
                                        </Checkbox>
                                    ))}

                                <br />

                                <Textarea
                                    label={descriptionLabel}
                                    maxLength={255}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    description="Legg ikke igjen personopplysinger i dette feltet"
                                    className="mb-8"
                                />

                                <BodyLong>
                                    <AkselLink href="/retningslinjer-stillingsannonser">
                                        Les om gjeldende regler
                                    </AkselLink>
                                </BodyLong>
                            </div>

                            {error && (
                                <Alert variant="error" className="mb-4 mt-4" role="alert">
                                    Rapportering feilet - prøv igjen
                                </Alert>
                            )}

                            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                                <Button
                                    variant="primary"
                                    disabled={(violationCategory === null && scamCategory === null) || !description}
                                    onClick={handleSendTip}
                                    className="mb-8"
                                >
                                    Send tips
                                </Button>
                            )}
                        </div>
                    )}

                    <BodyLong>
                        Stillingsannonser blir som regel umiddelbart publisert på arbeidsplassen.no. Etter publisering
                        vil alle annonser bli kontrollert etter NAVs retningslinjer. I tilfeller der det er brudd på
                        retningslinjene vil stillingsannonsene bli fjernet.
                    </BodyLong>
                </div>
            )}
        </div>
    );
}

export default ReportAd;
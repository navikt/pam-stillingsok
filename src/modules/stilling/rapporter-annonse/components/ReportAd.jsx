import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, BodyLong, Box, Button, Checkbox, Heading, Link as AkselLink, Textarea } from "@navikt/ds-react";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
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

function ReportAd({ id }) {
    const [error, setError] = useState(false);
    const [finished, setFinished] = useState(false);
    const [violation, setViolation] = useState(false);
    const [violationCategory, setViolationCategory] = useState(null);
    const [scam, setScam] = useState(false);
    const [scamCategory, setScamCategory] = useState(null);
    const [description, setDescription] = useState("");
    const [descriptionLabel, setDescriptionLabel] = useState("Beskrivelse - må fylles ut");

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
                    postingId: id,
                    description,
                },
                false,
            );

            setFinished(true);

            logAmplitudeEvent("Rapportering av stillingsannonse", {
                category,
                subCategory,
                title,
                postingId: id,
                description,
            });
        } catch (e) {
            setError(true);
        }
    }

    return (
        <div className="container-medium mt-12 mb-16 RapporterAnnonse">
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

                            <Checkbox name="regelbrudd" onChange={handleViolationCheck} checked={violation === true}>
                                Regelbrudd
                            </Checkbox>

                            <Box paddingInline="8 0">
                                {violation &&
                                    violationCategories.map((c) => (
                                        <Checkbox
                                            key={c.key}
                                            value={c.key}
                                            onChange={handleViolationCategoryCheck}
                                            checked={violationCategory === c.key}
                                        >
                                            {c.label}
                                        </Checkbox>
                                    ))}
                            </Box>
                            <Checkbox name="svindel" onChange={handleScamCheck} checked={scam === true}>
                                Mistanke om svindel
                            </Checkbox>

                            <Box paddingInline="8 0">
                                {scam &&
                                    scamCategories.map((c) => (
                                        <Checkbox
                                            key={c.key}
                                            value={c.key}
                                            onChange={handleScamCategoryCheck}
                                            checked={scamCategory === c.key}
                                        >
                                            {c.label}
                                        </Checkbox>
                                    ))}
                            </Box>
                            <br />

                            <Textarea
                                label={descriptionLabel}
                                maxLength={255}
                                value={description}
                                onChange={handleDescriptionChange}
                                description="Legg ikke igjen personopplysinger i dette feltet"
                                className="mb-8"
                            />

                            <BodyLong spacing>
                                <AkselLink href="/retningslinjer-stillingsannonser">Les om gjeldende regler</AkselLink>
                            </BodyLong>
                        </div>

                        {error && (
                            <Alert variant="error" className="mb-4 mt-4" role="alert">
                                Rapportering feilet - prøv igjen
                            </Alert>
                        )}

                        <Button
                            variant="primary"
                            disabled={(violationCategory === null && scamCategory === null) || !description}
                            onClick={handleSendTip}
                            className="mb-8"
                        >
                            Send tips
                        </Button>
                    </div>
                )}

                <BodyLong spacing>
                    Stillingsannonser blir som regel umiddelbart publisert på arbeidsplassen.no. Etter publisering vil
                    alle annonser bli kontrollert etter NAVs retningslinjer. I tilfeller der det er brudd på
                    retningslinjene vil stillingsannonsene bli fjernet.
                </BodyLong>
                <BodyLong spacing>
                    Dersom det gjelder mistanke om straffbare forhold ved virksomheten, for eksempel manglende
                    etterlevelse av arbeidsmiljøloven, svart arbeid eller lignende, så kan du også tipse Skatteetaten
                    eller Arbeidstilsynet direkte.
                </BodyLong>
                <BodyLong spacing>
                    <AkselLink href="https://tips.skatteetaten.no/web/tips/">Tips Skatteetaten</AkselLink>
                </BodyLong>
                <BodyLong spacing>
                    <AkselLink href="https://www.arbeidstilsynet.no/kontakt-oss/tips/">Tips Arbeidstilsynet</AkselLink>
                </BodyLong>
            </div>
        </div>
    );
}

ReportAd.propTypes = {
    id: PropTypes.string.isRequired,
};

export default ReportAd;

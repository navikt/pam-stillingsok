import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    BodyLong,
    Button,
    Checkbox,
    Heading,
    Link as AkselLink,
    LinkPanel,
    Textarea,
    Fieldset,
    CheckboxGroup,
} from "@navikt/ds-react";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import UserAPI from "../../../common/api/UserAPI";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";

const reportCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" },
];

function ReportAd({ id }) {
    const [error, setError] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [finished, setFinished] = useState(false);
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState("");
    const categoryFieldError = "Du må velge minst én grunn til at annonsen bryter rettningslinjene";
    const messageFieldError = "Du har brukt for mange tegn";

    useEffect(() => {
        if (isSubmittingForm && validationError === null) {
            submitForm();
            setIsSubmittingForm(false);
        }
    }, [validationError, isSubmittingForm]);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleCategoryChange = (values) => {
        setCategory({ ...values });
    };

    const validateForm = () => {
        setValidationError(null);
        if (category === null) {
            setValidationError({ ...validationError, categoryFieldError });
        }

        if (description.length > 300) {
            setValidationError({ ...validationError, messageFieldError });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        setIsSubmittingForm(true);
    };

    const submitForm = async () => {
        console.log("OYOY", category);
        const title = `En stilling har blitt rapportert for ${category.split(" ").toLowerCase()}`;

        try {
            // await UserAPI.post(
            //     "api/v1/reportposting",
            //     {
            //         category,
            //         title,
            //         postingId: id,
            //         description,
            //     },
            //     false,
            // );

            setFinished(true);

            logAmplitudeEvent("Rapportering av stillingsannonse", {
                category,
                title,
                postingId: id,
            });
        } catch (e) {
            setError(true);
        }
    };

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
                    <>
                        <Heading level="1">Rapporter annonse</Heading>
                        <BodyLong>
                            Alle annonser på arbeidsplassen.no skal følge{" "}
                            <AkselLink href="/retningslinjer-stillingsannonser">
                                NAVs retningslinjer for stillingsannonser
                            </AkselLink>
                            . I tilfeller der det er brudd på retningslinjene vil stillingsannonsene bli fjernet.
                        </BodyLong>
                        <form onSubmit={handleSubmit}>
                            <Fieldset legend={<Heading level="2">Hvilke retningslinjer bryter annonsen?</Heading>}>
                                <CheckboxGroup
                                    onChange={(values) => handleCategoryChange(values)}
                                    error={validationError?.categoryFieldError}
                                >
                                    {reportCategories.map((c) => (
                                        <Checkbox key={c.key} value={c.key}>
                                            {c.label}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                                <Textarea
                                    error={validationError?.messageFieldError}
                                    label="Legg til utdypende informasjon"
                                    maxLength={300}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    description="Valgfritt. Vennligst ikke skriv inn personopplysninger."
                                />
                                <BodyLong>
                                    Når du har sendt inn tipset, vurderer vi om annonsen bryter retningslinjene og om
                                    den skal fjernes. Ditt tips er anonymt.
                                </BodyLong>
                                <Button variant="primary" className="mb-8">
                                    Rapporter annonse
                                </Button>
                            </Fieldset>
                        </form>
                    </>
                )}

                <LinkPanel className="arb-link-panel-primary" href="https://tips.skatteetaten.no/web/tips/">
                    <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                        Send tips til Skatteetaten
                    </LinkPanel.Title>
                    <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                        Ved mistanke om for eksempel svart arbeid eller ulovlig utleie.
                    </LinkPanel.Description>
                </LinkPanel>
                <LinkPanel className="arb-link-panel-secondary" href="https://www.arbeidstilsynet.no/kontakt-oss/tips/">
                    <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                        Send tips til Arbeidstilsynet
                    </LinkPanel.Title>
                    <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                        Ved mistanke om kritikkverdige arbeidsmiljøforhold.
                    </LinkPanel.Description>
                </LinkPanel>
            </div>
        </div>
    );
}

ReportAd.propTypes = {
    id: PropTypes.string.isRequired,
};

export default ReportAd;

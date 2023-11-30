import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    Bleed,
    BodyLong,
    Box,
    Button,
    Checkbox,
    Heading,
    Link as AkselLink,
    LinkPanel,
    Textarea,
    Fieldset,
    CheckboxGroup,
    VStack,
    BodyShort,
} from "@navikt/ds-react";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import UserAPI from "../../../common/api/UserAPI";

const reportCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" },
];

function ReportAd({ ad }) {
    const [error, setError] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [finished, setFinished] = useState(false);
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState("");
    const categoryFieldError = "Du må velge minst én grunn til at annonsen bryter rettningslinjene";
    const messageFieldError = "Du har brukt for mange tegn";

    const submitForm = async () => {
        const title = `En stilling har blitt rapportert for ${Object.values(category).toString().toLowerCase()}`;

        try {
            await UserAPI.postWithoutCredentials(
                "api/v1/reportposting",
                {
                    category: Object.values(category).toString(),
                    title,
                    postingId: ad._id,
                    description,
                },
                false,
            );

            setFinished(true);

            logAmplitudeEvent("Rapportering av stillingsannonse", {
                category: Object.values(category).toString(),
                title,
                postingId: ad._id,
            });
        } catch (e) {
            setError(true);
        }
    };

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

    const validateForm = async () => {
        await setValidationError(() => {
            return null;
        });
        if (category === null) {
            await setValidationError((validationError) => {
                return { ...validationError, categoryFieldError };
            });
        }

        if (description.length > 300) {
            await setValidationError((validationError) => {
                return { ...validationError, messageFieldError };
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await validateForm();
        setIsSubmittingForm(true);
    };

    return (
        <>
            <Bleed className="mb-8">
                <Box background="surface-alt-1-subtle" paddingBlock="4">
                    <div className="container-small">
                        <BodyShort weight="semibold">{ad._source.title}</BodyShort>
                        <BodyShort>{ad._source.businessName}</BodyShort>
                    </div>
                </Box>
            </Bleed>
            <div className="container-small mb-16 RapporterAnnonse">
                <div>
                    {finished && (
                        <div>
                            <Heading level="1" className="mb-4">
                                Takk for din tilbakemelding
                            </Heading>

                            <div className="report-form mb-12">
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
                            <Heading level="1" className="mb-4">
                                Rapporter annonse
                            </Heading>
                            <BodyLong className="mb-8">
                                Alle annonser på arbeidsplassen.no skal følge{" "}
                                <AkselLink href="/retningslinjer-stillingsannonser">
                                    NAVs retningslinjer for stillingsannonser
                                </AkselLink>
                                . I tilfeller der det er brudd på retningslinjene vil stillingsannonsene bli fjernet.
                            </BodyLong>
                            <form onSubmit={handleSubmit}>
                                <Fieldset legend={<Heading level="2">Hvilke retningslinjer bryter annonsen?</Heading>}>
                                    <CheckboxGroup
                                        className="mb-8"
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
                                        className="mb-8"
                                        error={validationError?.messageFieldError}
                                        label="Legg til utdypende informasjon"
                                        maxLength={300}
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        description="Valgfritt. Vennligst ikke skriv inn personopplysninger."
                                    />
                                    <BodyLong className="mb-4">
                                        Når du har sendt inn tipset, vurderer vi om annonsen bryter retningslinjene og
                                        om den skal fjernes. Ditt tips er anonymt.
                                    </BodyLong>
                                    <Button variant="primary" className="mb-12">
                                        Rapporter annonse
                                    </Button>
                                </Fieldset>
                            </form>
                        </>
                    )}
                    <VStack gap="4">
                        <LinkPanel className="arb-link-panel-tertiary" href="https://tips.skatteetaten.no/web/tips/">
                            <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                                Send tips til Skatteetaten
                            </LinkPanel.Title>
                            <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                                Ved mistanke om for eksempel svart arbeid eller ulovlig utleie.
                            </LinkPanel.Description>
                        </LinkPanel>
                        <LinkPanel
                            className="arb-link-panel-tertiary"
                            href="https://www.arbeidstilsynet.no/kontakt-oss/tips/"
                        >
                            <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                                Send tips til Arbeidstilsynet
                            </LinkPanel.Title>
                            <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                                Ved mistanke om kritikkverdige arbeidsmiljøforhold.
                            </LinkPanel.Description>
                        </LinkPanel>
                    </VStack>
                </div>
            </div>
        </>
    );
}

ReportAd.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string,
        _source: PropTypes.shape({
            businessName: PropTypes.string,
            title: PropTypes.string,
        }),
    }).isRequired,
};

export default ReportAd;

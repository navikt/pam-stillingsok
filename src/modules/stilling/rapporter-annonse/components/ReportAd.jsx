import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    Bleed,
    BodyLong,
    BodyShort,
    Box,
    Button,
    Checkbox,
    ErrorSummary,
    Fieldset,
    Heading,
    Link as AkselLink,
    LinkPanel,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import { FetchStatus } from "../../../common/hooks/useFetchReducer";

const reportCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" },
];

function ReportAd({ ad, submitForm, postReportStatus, validationErrors }) {
    const errorSummary = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(e);
    };

    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            errorSummary.current.focus();
        }
    }, [validationErrors]);

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
            <div className="container-small mb-16">
                <div>
                    {postReportStatus === FetchStatus.SUCCESS ? (
                        <div>
                            <Heading level="1" size="xlarge" className="mb-4">
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
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Heading level="1" size="xlarge" className="mb-4">
                                Rapporter annonse
                            </Heading>
                            <BodyLong className="mb-8">
                                Alle annonser på arbeidsplassen.no skal følge{" "}
                                <AkselLink href="/retningslinjer-stillingsannonser" className="display-inline">
                                    NAVs retningslinjer for stillingsannonser
                                </AkselLink>
                                . I tilfeller der det er brudd på retningslinjene vil stillingsannonsene bli fjernet.
                            </BodyLong>

                            {Object.keys(validationErrors).length > 0 && (
                                <ErrorSummary ref={errorSummary} heading="Skjemaet inneholder feil" className="mb-12">
                                    {Object.entries(validationErrors).map(([key, value]) => (
                                        <ErrorSummary.Item key={key} href={`#${key}`}>
                                            {value}
                                        </ErrorSummary.Item>
                                    ))}
                                </ErrorSummary>
                            )}

                            <Heading level="2" className="mb-4">
                                Hvilke retningslinjer bryter annonsen?
                            </Heading>
                            <Fieldset
                                id="categoryFieldSet"
                                legend="Velg kategori"
                                hideLegend
                                error={validationErrors.categoryFieldset}
                                className="mb-8"
                            >
                                <div>
                                    {reportCategories.map((c) => (
                                        <Checkbox name="category" value={c.label} key={c.key}>
                                            {c.label}
                                        </Checkbox>
                                    ))}
                                </div>
                            </Fieldset>
                            <Textarea
                                id="messageField"
                                className="mb-8"
                                error={validationErrors.messageField}
                                label="Legg til utdypende informasjon"
                                maxLength={300}
                                name="description"
                                description="Valgfritt. Vennligst ikke skriv inn personopplysninger."
                            />
                            <BodyLong className="mb-4">
                                Når du har sendt inn tipset, vurderer vi om annonsen bryter retningslinjene og om den
                                skal fjernes. Ditt tips er anonymt.
                            </BodyLong>

                            {postReportStatus === FetchStatus.FAILURE && (
                                <Alert variant="error" className="mb-4">
                                    Noe feil
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                loading={postReportStatus === FetchStatus.IS_FETCHING}
                                variant="primary"
                                className="mb-12"
                            >
                                Rapporter annonse
                            </Button>
                        </form>
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
    submitForm: PropTypes.func.isRequired,
    postReportStatus: PropTypes.string.isRequired,
    validationErrors: PropTypes.shape({
        categoryFieldset: PropTypes.string,
        messageField: PropTypes.string,
    }).isRequired,
};

export default ReportAd;

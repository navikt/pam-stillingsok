"use client";

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    Bleed,
    BodyLong,
    BodyShort,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    ErrorSummary,
    Heading,
    HStack,
    Link as AkselLink,
    LinkPanel,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import Link from "next/link";

const reportCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" },
];

function ReportAd({ ad, submitForm }) {
    const errorSummary = useRef();
    const ref = useRef(null);
    const [description, setDescription] = useState("");

    const [state, setState] = useState({ validationErrors: {}, success: false, error: false });
    const [isPending, setIsPending] = useState(false);

    const { validationErrors } = state;
    const [fixedErrors, setFixedErrors] = useState([]);
    const [localSummary, setLocalSummary] = useState(validationErrors);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    useEffect(() => {
        setFixedErrors([]);
        setLocalSummary(validationErrors);
    }, [validationErrors]);

    useEffect(() => {
        if (fixedErrors.length === 0 && Object.keys(localSummary).length > 0) {
            errorSummary.current.focus();
        }
    }, [localSummary, fixedErrors, errorSummary]);

    function setErrorAsFixed(fixed) {
        if (!fixedErrors.includes(fixed)) {
            setFixedErrors((prevState) => [...prevState, fixed]);

            const localSummaryWithoutFixes = {
                ...localSummary,
            };
            delete localSummaryWithoutFixes[fixed];
            setLocalSummary(localSummaryWithoutFixes);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        let result, fetchSuccess;
        const formData = new FormData(e.target);

        setIsPending(true);

        try {
            result = await submitForm(formData);
            fetchSuccess = true;
        } catch (err) {
            fetchSuccess = false;
        }

        if (fetchSuccess) {
            setState(result);
        } else {
            setState((prevState) => ({
                ...prevState,
                error: true,
            }));
        }
        setIsPending(false);
    };

    return (
        <>
            <Bleed className="mb-12">
                <Box background="surface-alt-1-subtle" paddingBlock="4">
                    <div className="container-small">
                        <BodyShort weight="semibold">{ad._source.title}</BodyShort>
                        <BodyShort>{ad._source.businessName}</BodyShort>
                    </div>
                </Box>
            </Bleed>
            <div className="container-small mb-16">
                <div>
                    {state.success ? (
                        <div>
                            <Heading
                                level="1"
                                size="xlarge"
                                className="mb-4"
                                ref={ref}
                                tabIndex={-1}
                                aria-live="polite"
                                role="alert"
                            >
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
                        <form onSubmit={onSubmit} method="post">
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

                            {Object.keys(localSummary).length > 0 && (
                                <ErrorSummary
                                    ref={errorSummary}
                                    heading="Du må rette noen feil før du kan rapportere annonsen"
                                    className="mb-12"
                                >
                                    {Object.entries(localSummary).map(([key, value]) => (
                                        <ErrorSummary.Item key={key} href={`#${key}`}>
                                            {value}
                                        </ErrorSummary.Item>
                                    ))}
                                </ErrorSummary>
                            )}

                            <CheckboxGroup
                                id="categoryFieldset"
                                legend="Velg hvilke retningslinjer annonsen bryter"
                                description="Velg minst èn"
                                className="mb-8"
                                onChange={() => {
                                    setErrorAsFixed("categoryFieldset");
                                }}
                                error={!fixedErrors.includes("categoryFieldset") && validationErrors.categoryFieldset}
                            >
                                {reportCategories.map((c) => (
                                    <Checkbox name="category" value={c.label} key={c.key} onChange={() => {}}>
                                        {c.label}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                            <Textarea
                                id="messageField"
                                className="mb-8"
                                label="Legg til utdypende informasjon"
                                maxLength={300}
                                name="description"
                                description="Valgfritt. Vennligst ikke skriv inn personopplysninger."
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrorAsFixed("messageField");
                                }}
                                error={!fixedErrors.includes("messageField") && validationErrors.messageField}
                            />
                            <BodyLong className="mb-4">
                                Når du har sendt inn tipset, vurderer vi om annonsen bryter retningslinjene og om den
                                skal fjernes. Ditt tips er anonymt.
                            </BodyLong>

                            {state?.error && (
                                <Alert variant="error" className="mb-4">
                                    Rapportering av annonse feilet.
                                </Alert>
                            )}

                            <HStack gap="4" className="mb-12">
                                <Button type="submit" variant="primary" loading={isPending}>
                                    Rapporter annonse
                                </Button>
                                {!isPending && (
                                    <Button type="button" variant="secondary" as={Link} href={`/stilling/${ad._id}`}>
                                        Avbryt
                                    </Button>
                                )}
                            </HStack>
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
    validationErrors: PropTypes.shape({
        categoryFieldset: PropTypes.string,
        messageField: PropTypes.string,
    }),
};

export default ReportAd;

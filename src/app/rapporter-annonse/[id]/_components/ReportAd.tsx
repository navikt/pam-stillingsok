"use client";

import React, { useEffect, useRef, useState, FormEvent } from "react";
import {
    Bleed,
    BodyLong,
    BodyShort,
    Box,
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
import ApiErrorMessage from "@/app/_common/components/ApiErrorMessage";
import { FormButtonBar } from "./FormButtonBar";

interface AdProps {
    _id: string;
    _source: {
        businessName: string;
        title: string;
    };
}

interface ValidationErrors {
    categoryFieldset?: string;
    messageField?: string;
    [key: string]: string | undefined;
}

interface ReportAdProps {
    ad: AdProps;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submitForm: (formData: FormData) => Promise<any>;
}

const reportCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: "Annet", key: "other" },
];

export default function ReportAd({ ad, submitForm }: ReportAdProps): JSX.Element {
    const errorSummary = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLHeadingElement>(null);
    const [description, setDescription] = useState<string>("");

    const [state, setState] = useState({
        validationErrors: {} as ValidationErrors,
        success: false,
        error: false as string | boolean,
    });
    const { validationErrors } = state;
    const [fixedErrors, setFixedErrors] = useState<string[]>([]);
    const [localSummary, setLocalSummary] = useState<ValidationErrors>(validationErrors);

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
        if (fixedErrors.length === 0 && Object.keys(localSummary).length > 0 && errorSummary.current) {
            errorSummary.current.focus();
        }
    }, [localSummary, fixedErrors]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        let result;
        let fetchSuccess;

        try {
            result = await submitForm(formData);
            fetchSuccess = true;
        } catch {
            fetchSuccess = false;
        }

        if (fetchSuccess) {
            setState(result);
        } else {
            setState((prevState) => ({
                ...prevState,
                error: "offline",
            }));
        }
    };

    const setErrorAsFixed = (fixed: string): void => {
        if (!fixedErrors.includes(fixed)) {
            setFixedErrors((prevState) => [...prevState, fixed]);

            const localSummaryWithoutFixes = { ...localSummary };
            delete localSummaryWithoutFixes[fixed];
            setLocalSummary(localSummaryWithoutFixes);
        }
    };

    return (
        <>
            <Bleed className="mb-10">
                <Box background="surface-alt-1-subtle" paddingBlock="4">
                    <div className="container-small">
                        <BodyShort weight="semibold">{ad._source.title}</BodyShort>
                        <BodyShort>{ad._source.businessName}</BodyShort>
                    </div>
                </Box>
            </Bleed>
            <div className="container-small mb-24">
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
                        <form onSubmit={onSubmit}>
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
                                description="Velg minst én"
                                className="mb-8"
                                onChange={() => {
                                    setErrorAsFixed("categoryFieldset");
                                }}
                                error={!fixedErrors.includes("categoryFieldset") && validationErrors.categoryFieldset}
                            >
                                {reportCategories.map((c) => (
                                    <Checkbox name="category" value={c.label} key={c.key}>
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
                            {state.error && <ApiErrorMessage apiErrorCode={state.error as string} />}
                            <HStack gap="4" className="mb-12">
                                <FormButtonBar id={ad._id} />
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

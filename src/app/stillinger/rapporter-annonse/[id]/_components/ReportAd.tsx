"use client";

import React, { useEffect, useRef, useState, FormEvent } from "react";
import {
    Alert,
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
import ApiErrorMessage from "@/app/stillinger/_common/components/ApiErrorMessage";
import { FormButtonBar } from "./FormButtonBar";
import { FormState } from "@/app/stillinger/_common/types/FormState";
import NextLink from "next/link";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

interface ValidationErrors {
    categoryFieldset?: string;
    messageField?: string;
    [key: string]: string | undefined;
}

interface ReportAdProps {
    ad: AdDTO;
    submitForm: (formData: FormData) => Promise<FormState>;
}

const ANNET_LABEL = "Annet";

const reportCategories = [
    { label: "Diskriminerende innhold", key: "discrimination" },
    { label: "Det er markedsføring", key: "marketing" },
    { label: "Falsk stillingannonse og arbeidsgiver", key: "fake" },
    { label: "Krever betaling for å søke stilling", key: "payment" },
    { label: "Ber om kredittinfo og/eller BankID", key: "creditInfo" },
    { label: ANNET_LABEL, key: "other" },
];

export default function ReportAd({ ad, submitForm }: ReportAdProps) {
    const errorSummary = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLHeadingElement>(null);
    const [description, setDescription] = useState<string>("");
    const [checkedCategories, setCheckedCategories] = useState<string[]>([]);

    const [state, setState] = useState<FormState>({
        validationErrors: {} as ValidationErrors,
        success: false,
        error: "",
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
        let result: FormState = {
            validationErrors: {},
            success: false,
            error: "",
        };
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
                        <BodyShort weight="semibold">{ad.title}</BodyShort>
                        <BodyShort>{ad.employer?.name}</BodyShort>
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
                                    Har du spørsmål kan du{" "}
                                    <AkselLink href="/kontakt" as={NextLink}>
                                        kontakte oss her.
                                    </AkselLink>
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
                                <AkselLink
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="/retningslinjer-stillingsannonser"
                                    inlineText
                                >
                                    Navs retningslinjer for stillingsannonser (åpner i ny fane)
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
                                className="mb-4"
                                onChange={(values) => {
                                    setCheckedCategories(values);
                                    setErrorAsFixed("categoryFieldset");
                                }}
                                value={checkedCategories}
                                error={!fixedErrors.includes("categoryFieldset") && validationErrors.categoryFieldset}
                            >
                                {reportCategories.map((c) => (
                                    <Checkbox name="category" value={c.label} key={c.key}>
                                        {c.label}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>

                            {checkedCategories.includes(ANNET_LABEL) && (
                                <Alert variant="info" className="mb-8" role="alert" aria-live="polite">
                                    <BodyShort spacing>
                                        Ved mistanke om svart arbeid eller ulovlig utleie,{" "}
                                        <AkselLink
                                            inlineText
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://tips.skatteetaten.no/web/tips/"
                                        >
                                            send tips til Skatteetaten (åpner i ny fane)
                                        </AkselLink>
                                        {"."}
                                    </BodyShort>
                                    <BodyShort spacing>
                                        Gjelder det kritikkverdige arbeidsforhold?{" "}
                                        <AkselLink
                                            inlineText
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.arbeidstilsynet.no/kontakt-oss/tips/"
                                        >
                                            Send tips til Arbeidstilsynet (åpner i ny fane)
                                        </AkselLink>
                                        {"."}
                                    </BodyShort>
                                    <BodyShort>
                                        Ved mistanke om trygdesvindel, send{" "}
                                        <AkselLink
                                            inlineText
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.nav.no/tips-om-trygdesvindel"
                                        >
                                            tips til Nav om mulig trygdesvindel (åpner i ny fane)
                                        </AkselLink>
                                        {"."}
                                    </BodyShort>
                                </Alert>
                            )}

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
                            {state.error && (
                                <ApiErrorMessage
                                    errorHeading="Det oppstod dessverre en feil"
                                    apiErrorCode={state.error as string}
                                />
                            )}
                            <HStack gap="4" className="mb-12">
                                <FormButtonBar id={ad.id} />
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
                        <LinkPanel className="arb-link-panel-tertiary" href="https://www.nav.no/tips-om-trygdesvindel">
                            <LinkPanel.Title className="navds-link-panel__title navds-heading--small">
                                Send tips til Nav
                            </LinkPanel.Title>
                            <LinkPanel.Description className="navds-link-panel__description navds-body-long">
                                Ved mistanke om trygdesvindel.
                            </LinkPanel.Description>
                        </LinkPanel>
                    </VStack>
                </div>
            </div>
        </>
    );
}

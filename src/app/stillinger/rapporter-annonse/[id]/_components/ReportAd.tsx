"use client";

import React, { useEffect, useRef, useState, FormEvent } from "react";
import {
    BodyLong,
    BodyShort,
    Box,
    Checkbox,
    CheckboxGroup,
    ErrorSummary,
    Heading,
    HStack,
    InfoCard,
    LinkCard,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import ApiErrorMessage from "@/app/stillinger/_common/components/ApiErrorMessage";
import { FormButtonBar } from "./FormButtonBar";
import { FormState } from "@/app/stillinger/_common/types/FormState";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { PageBlock } from "@navikt/ds-react/Page";
import { LinkCardAnchor, LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { InformationSquareIcon } from "@navikt/aksel-icons";

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
            <Box paddingBlock="space-16" className="bg-brand-green-subtle mb-10">
                <PageBlock as="header" width="text" gutters>
                    <Heading level="2" size={"xsmall"}>
                        {ad.title}
                    </Heading>
                    <BodyShort>{ad.employer?.name}</BodyShort>
                </PageBlock>
            </Box>
            <PageBlock as="section" width="text" gutters className="mb-24">
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
                                    <AkselNextLink href="/kontakt">kontakte oss her.</AkselNextLink>
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
                                <AkselNextLink
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="/retningslinjer-stillingsannonser"
                                    inlineText
                                >
                                    Navs retningslinjer for stillingsannonser (åpner i ny fane)
                                </AkselNextLink>
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
                                <InfoCard data-color="info" className="mb-8" role="alert" aria-live="polite">
                                    <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                                        <InfoCard.Title>Tips relevante myndigheter</InfoCard.Title>
                                    </InfoCard.Header>
                                    <InfoCard.Content>
                                        <BodyShort spacing>
                                            Ved mistanke om svart arbeid eller ulovlig utleie,{" "}
                                            <AkselNextLink
                                                inlineText
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://tips.skatteetaten.no/web/tips/"
                                            >
                                                send tips til Skatteetaten (åpner i ny fane)
                                            </AkselNextLink>
                                            {"."}
                                        </BodyShort>
                                        <BodyShort spacing>
                                            Gjelder det kritikkverdige arbeidsforhold?{" "}
                                            <AkselNextLink
                                                inlineText
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://www.arbeidstilsynet.no/kontakt-oss/tips/"
                                            >
                                                Send tips til Arbeidstilsynet (åpner i ny fane)
                                            </AkselNextLink>
                                            {"."}
                                        </BodyShort>
                                        <BodyShort>
                                            Ved mistanke om trygdesvindel, send{" "}
                                            <AkselNextLink
                                                inlineText
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://www.nav.no/tips-om-trygdesvindel"
                                            >
                                                tips til Nav om mulig trygdesvindel (åpner i ny fane)
                                            </AkselNextLink>
                                            {"."}
                                        </BodyShort>
                                    </InfoCard.Content>
                                </InfoCard>
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
                            <HStack gap="space-16" className="mb-12">
                                <FormButtonBar id={ad.id} />
                            </HStack>
                        </form>
                    )}
                    <VStack gap="space-16">
                        <LinkCard className="arb-link-panel-tertiary">
                            <LinkCardTitle>
                                <LinkCardAnchor href="https://tips.skatteetaten.no/web/tips/">
                                    Send tips til Skatteetaten
                                </LinkCardAnchor>
                            </LinkCardTitle>
                            <LinkCardDescription>
                                Ved mistanke om for eksempel svart arbeid eller ulovlig utleie.
                            </LinkCardDescription>
                        </LinkCard>

                        <LinkCard className="arb-link-panel-tertiary">
                            <LinkCardTitle>
                                <LinkCardAnchor href="https://www.arbeidstilsynet.no/kontakt-oss/tips/">
                                    Send tips til Arbeidstilsynet
                                </LinkCardAnchor>
                            </LinkCardTitle>
                            <LinkCardDescription>
                                Ved mistanke om kritikkverdige arbeidsmiljøforhold.
                            </LinkCardDescription>
                        </LinkCard>

                        <LinkCard className="arb-link-panel-tertiary">
                            <LinkCardTitle>
                                <LinkCardAnchor href="https://www.nav.no/tips-om-trygdesvindel">
                                    Send tips til Nav
                                </LinkCardAnchor>
                            </LinkCardTitle>
                            <LinkCardDescription>Ved mistanke om trygdesvindel.</LinkCardDescription>
                        </LinkCard>
                    </VStack>
                </div>
            </PageBlock>
        </>
    );
}

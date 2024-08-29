"use client";

import {
    Alert,
    BodyLong,
    BodyShort,
    Button,
    ErrorSummary,
    Heading,
    Link,
    Loader,
    Radio,
    RadioGroup,
    VStack,
} from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

const QUESTION_1 = "Hvor mange av jobbsøkerne som har tatt kontakt virker aktuelle?";
const QUESTION_1_ID = "hvor_mange_av_jobbsokerne_som_har_tatt_kontakt_virker_aktuelle";
const QUESTION_2 = "Ville du brukt arbeidsplassen.no neste gang du skal rekruttere?";
const QUESTION_2_ID = "ville_du_brukt_arbeidsplassen_no_neste_gang_du_skal_rekruttere";
const HOTJAR_URL = "https://surveys.hotjar.com/94ceef29-ea1d-41ca-8c42-a455019b394b";

export default function SporreundersokelseBedrift({ surveyId }) {
    const [surveyMetadata, setSurveyMetadata] = useState({});
    const [surveyMetadataFetchStatus, setSurveyMetadataFetchStatus] = useState("not_fetched");
    const [question1Answer, setQuestion1Answer] = useState(undefined);
    const [question2Answer, setQuestion2Answer] = useState(undefined);

    // Skip validation until Send button has been clicked at least once
    const [skipValidation, setSkipValidation] = useState(true);

    const [isErrorSummaryVisible, setIsErrorSummaryVisible] = useState(false);
    const [hasSentAnswers, setHasSentAnswers] = useState(false);

    const errorSummaryRef = useRef(null);
    const thankYouHeadingRef = useRef(null);

    function validateForm() {
        const hasErrors = question1Answer === undefined || question2Answer === undefined;

        if (!hasErrors) {
            setIsErrorSummaryVisible(false);
        }

        return hasErrors;
    }

    function sendAmplitudeEvent() {
        logAmplitudeEvent("Answered survey", {
            [QUESTION_1_ID]: question1Answer,
            [QUESTION_2_ID]: question2Answer,
            surveyId: "en-kort-sporreundersokelse-bedrift",
            ...surveyMetadata,
        });

        fetch(`/survey-api/survey/${surveyId}`, { method: "DELETE" });
    }

    function onFormSubmit(e) {
        e.preventDefault();

        setSkipValidation(false);
        const hasErrors = validateForm();

        if (!hasErrors) {
            sendAmplitudeEvent();
            setHasSentAnswers(true);
        } else if (isErrorSummaryVisible) {
            if (errorSummaryRef.current) {
                errorSummaryRef.current.focus();
            }
        } else {
            setIsErrorSummaryVisible(true);
        }
    }

    useEffect(() => {
        if (errorSummaryRef.current && isErrorSummaryVisible) {
            errorSummaryRef.current.focus();
        }
    }, [isErrorSummaryVisible]);

    useEffect(() => {
        if (!skipValidation) {
            validateForm();
        }
    }, [question1Answer, question2Answer]);

    useEffect(() => {
        // To help screen reader users, set focus to h1 when "Thank you" section is shown
        if (hasSentAnswers && thankYouHeadingRef.current) {
            thankYouHeadingRef.current.focus();
            window.scrollTo(0, 0);
        }
    }, [hasSentAnswers]);

    const asBooleanOrUndefined = (value) => {
        if (value === true || value === "true") {
            return true;
        }
        if (value === false || value === "false") {
            return false;
        }
        return undefined;
    };

    const fetchSurveyMetadata = async () => {
        setSurveyMetadataFetchStatus("loading");
        try {
            const response = await fetch(`/survey-api/survey/${surveyId}`);
            if (response.status === 200) {
                setSurveyMetadataFetchStatus("success");
                const data = await response.json();
                setSurveyMetadata({
                    hasMultipleAds: asBooleanOrUndefined(data.hasMultipleAds),
                    hasApplicationEmail: asBooleanOrUndefined(data.metadata.hasApplicationEmail),
                    hasApplicationSuperraskSoknad: asBooleanOrUndefined(data.metadata.hasApplicationSuperraskSoknad),
                    hasApplicationUrl: asBooleanOrUndefined(data.metadata.hasApplicationUrl),
                });
            } else if (response.status === 404) {
                setSurveyMetadataFetchStatus("not-found");
            } else if (response.status === 410) {
                setSurveyMetadataFetchStatus("gone");
            } else {
                setSurveyMetadataFetchStatus("error");
            }
        } catch (err) {
            setSurveyMetadataFetchStatus("error");
        }
    };

    useEffect(() => {
        if (surveyId) {
            fetchSurveyMetadata();
        }
    }, [surveyId]);

    const errorSummaryItems = [];
    if (question1Answer === undefined) {
        errorSummaryItems.push(
            <ErrorSummary.Item key={QUESTION_1_ID} href={`#${QUESTION_1_ID}`}>
                {QUESTION_1}
            </ErrorSummary.Item>,
        );
    }
    if (question2Answer === undefined) {
        errorSummaryItems.push(
            <ErrorSummary.Item key={QUESTION_2_ID} href={`#${QUESTION_2_ID}`}>
                {QUESTION_2}
            </ErrorSummary.Item>,
        );
    }

    const disabled =
        surveyMetadataFetchStatus === "error" ||
        surveyMetadataFetchStatus === "not-found" ||
        surveyMetadataFetchStatus === "gone";

    return (
        <article className="container-small mt-12 mb-24">
            {(surveyMetadataFetchStatus === "not_fetched" || surveyMetadataFetchStatus === "loading") && (
                <VStack align="center">
                    <Loader size="2xlarge" />
                </VStack>
            )}
            {(surveyMetadataFetchStatus === "success" ||
                surveyMetadataFetchStatus === "not-found" ||
                surveyMetadataFetchStatus === "gone" ||
                surveyMetadataFetchStatus === "error") && (
                <div>
                    {!hasSentAnswers ? (
                        <form onSubmit={onFormSubmit}>
                            <Heading spacing size="large" level="1">
                                En meget kort spørreundersøkelse for deg som nylig har rekruttert
                            </Heading>
                            <BodyLong className="mb-8">
                                Vi vil gjerne vite hvordan vi kan forbedre opplevelsen din til neste gang.
                                Spørreundersøkelsen er frivillig.
                            </BodyLong>

                            {surveyMetadataFetchStatus === "gone" && (
                                <Alert variant="warning" className="mb-8">
                                    <BodyShort spacing>
                                        Lenken er ikke lengre gyldig og spørreundersøkelsen kan ikke besvares
                                    </BodyShort>
                                    <BodyShort spacing>
                                        Du kan forsatt skrive en tilbakemelding til oss. Tilbakemeldingen din vil være
                                        anonym.
                                    </BodyShort>
                                    <BodyShort>
                                        <Link href={HOTJAR_URL}>Skriv en kort tilbakemelding</Link>
                                    </BodyShort>
                                </Alert>
                            )}

                            {(surveyMetadataFetchStatus === "not-found" || surveyMetadataFetchStatus === "error") && (
                                <Alert variant="error" className="mb-8">
                                    <Heading size="xsmall" level="2" spacing>
                                        Det har oppstått en feil med spørreundersøkelsen.
                                    </Heading>
                                    <BodyShort spacing>
                                        Det kan være feil i lenken som førte deg hit. Forsøk å laste siden på nytt eller
                                        prøv igjen senere.
                                    </BodyShort>
                                    <BodyShort spacing>
                                        Du kan forsatt skrive en tilbakemelding til oss. Tilbakemeldingen din vil være
                                        anonym.
                                    </BodyShort>
                                    <BodyShort>
                                        <Link href={HOTJAR_URL}>Skriv en kort tilbakemelding</Link>
                                    </BodyShort>
                                </Alert>
                            )}

                            {isErrorSummaryVisible && (
                                <ErrorSummary
                                    ref={errorSummaryRef}
                                    heading="Du må velge et svar i følgende spørsmål før du sender inn:"
                                    className="mb-8"
                                >
                                    {errorSummaryItems}
                                </ErrorSummary>
                            )}

                            <RadioGroup
                                disabled={disabled}
                                id={QUESTION_1_ID}
                                legend={QUESTION_1}
                                className="mb-8"
                                onChange={(value) => setQuestion1Answer(value)}
                                error={
                                    isErrorSummaryVisible && question1Answer === undefined
                                        ? `Velg hvor mange av jobbsøkerne som har tatt kontakt som virker aktuelle. Er du usikker kan du velge Vet ikke.`
                                        : undefined
                                }
                            >
                                <Radio value="Nesten alle">Nesten alle</Radio>
                                <Radio value="En hel del">En hel del</Radio>
                                <Radio value="Noen få">Noen få</Radio>
                                <Radio value="Ingen">Ingen</Radio>
                                <Radio value="Vet ikke">Vet ikke</Radio>
                            </RadioGroup>

                            <RadioGroup
                                disabled={disabled}
                                id={QUESTION_2_ID}
                                legend={QUESTION_2}
                                className="mb-8"
                                onChange={(value) => setQuestion2Answer(value)}
                                error={
                                    isErrorSummaryVisible && question2Answer === undefined
                                        ? "Velg om du ville brukt arbeidsplassen.no neste gang du skal rekruttere. Er du usikker kan du velge Vet ikke."
                                        : undefined
                                }
                            >
                                <Radio value="Ja">Ja</Radio>
                                <Radio value="Nei">Nei</Radio>
                                <Radio value="Vet ikke">Vet ikke</Radio>
                            </RadioGroup>
                            <Button
                                disabled={disabled}
                                type="submit"
                                variant="primary"
                                onClick={(e) => {
                                    onFormSubmit(e);
                                }}
                            >
                                Send inn svar
                            </Button>
                        </form>
                    ) : (
                        <>
                            <Heading tabIndex="-1" spacing size="large" level="1" ref={thankYouHeadingRef}>
                                Takk for svaret!
                            </Heading>
                            <BodyLong spacing>
                                Uten tilbakemeldingen din ville vi ikke klart å lage bedre tjenester.
                            </BodyLong>
                            <Heading size="small" level="2" className="mb-2">
                                Er noe du savner eller synes kunne vært bedre?
                            </Heading>
                            <BodyLong className="mb-2">
                                Vi setter stor pris på å høre mer om hvordan vi kan forbedre tjenestene våre for deg.
                                Tilbakemeldingen din vil være anonym.
                            </BodyLong>

                            <BodyLong>
                                <Link href={HOTJAR_URL}>Skriv en kort tilbakemelding</Link>
                            </BodyLong>
                        </>
                    )}
                </div>
            )}
        </article>
    );
}

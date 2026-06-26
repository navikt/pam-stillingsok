import {
    BodyLong,
    Checkbox,
    CheckboxGroup,
    ErrorSummary,
    Heading,
    ReadMore,
    Textarea,
    TextField,
} from "@navikt/ds-react";
import { type FormEvent, useContext, useEffect, useRef, useState } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import ApiErrorMessage from "@/app/stillinger/_common/components/ApiErrorMessage";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { FormButtonBar } from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/FormButtonBar";
import LoginBanner from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/LoginBanner";
import type { ApplicationForm } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { isMultipleQuestionsFormat } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import type { ValidationErrors } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/ValidationErrors";
import ScreeningQuestions from "./ScreeningQuestions";
import { MOTIVATION_MAX_LENGTH } from "./validateForm";

function flattenValidationErrors(summary: ValidationErrors): [string, string][] {
    return Object.entries(summary).flatMap(([key, value]) => {
        if (key === "answers" && typeof value === "object") {
            return Object.entries(value as Record<string, string>).map(
                ([qId, msg]) => [`screening-${qId}`, msg] as [string, string],
            );
        }
        return typeof value === "string" ? ([[key, value]] as [string, string][]) : [];
    });
}

interface FormProps {
    ad: AdDTO;
    applicationForm: ApplicationForm;
    onSubmit: (e: FormEvent) => void;
    error?: string;
    validationErrors: ValidationErrors;
    isPending: boolean;
}

function Form({ ad, applicationForm, onSubmit, error, validationErrors, isPending }: FormProps) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const errorSummary = useRef<HTMLDivElement | null>(null);
    const [motivation, setMotivation] = useState("");
    const [fixedErrors, setFixedErrors] = useState<(keyof ValidationErrors)[]>([]);
    const [fixedAnswerErrors, setFixedAnswerErrors] = useState<string[]>([]);
    const [localSummary, setLocalSummary] = useState<ValidationErrors>(validationErrors);
    const isNotLoggedIn = authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED;

    const isMultipleQuestions = isMultipleQuestionsFormat(applicationForm);

    useEffect(() => {
        setFixedErrors([]);
        setFixedAnswerErrors([]);
        setLocalSummary(validationErrors);
    }, [validationErrors]);

    useEffect(() => {
        if (fixedErrors.length === 0 && Object.keys(localSummary).length > 0) {
            errorSummary?.current?.focus();
        }
        // TODO: errorSummary er ref og endres ikke — men brukes i effekten for fokus
    }, [localSummary, fixedErrors, errorSummary]);

    function setErrorAsFixed(fixed: keyof ValidationErrors): void {
        if (!fixedErrors.includes(fixed)) {
            setFixedErrors((prevState) => [...prevState, fixed]);
            setLocalSummary((prev) => {
                const { [fixed]: _, ...rest } = prev;
                return rest;
            });
        }
    }

    function setAnswerErrorAsFixed(questionId: string): void {
        if (!fixedAnswerErrors.includes(questionId)) {
            setFixedAnswerErrors((prevState) => [...prevState, questionId]);
            setLocalSummary((prev) => {
                if (!prev.answers) {
                    return prev;
                }
                const { [questionId]: _, ...restAnswers } = prev.answers;
                if (Object.keys(restAnswers).length === 0) {
                    const { answers: __, ...withoutAnswers } = prev;
                    return withoutAnswers;
                }
                return { ...prev, answers: restAnswers };
            });
        }
    }

    const flatErrorEntries = flattenValidationErrors(localSummary);

    return (
        <form onSubmit={onSubmit} className="mb-16">
            <section className="mb-10">
                <Heading level="1" size="xlarge" spacing>
                    Superrask søknad
                </Heading>
                <BodyLong spacing>
                    Ingen CV eller langt søknadsbrev, kun tre raske steg. Du får beskjed på e-post med en gang bedriften
                    har vurdert søknaden din.
                </BodyLong>
                {flatErrorEntries.length > 0 && (
                    <ErrorSummary ref={errorSummary} heading="Skjemaet inneholder feil">
                        {flatErrorEntries.map(([key, value]) => (
                            <ErrorSummary.Item key={key} href={`#new-application-${key}`}>
                                {value}
                            </ErrorSummary.Item>
                        ))}
                    </ErrorSummary>
                )}
            </section>

            {isNotLoggedIn && <LoginBanner onLogin={login} />}

            {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                <section className="mb-10">
                    <Heading level="2" size="medium" spacing>
                        Bedriftens ønskede kvalifikasjoner
                    </Heading>
                    <BodyLong className="mb-8">
                        Husk at du kan være rett person for jobben selv om du ikke treffer på alle kvalifikasjoner.
                    </BodyLong>

                    {applicationForm.qualifications && applicationForm.qualifications.length > 0 && (
                        <CheckboxGroup legend="Huk av for kvalifikasjonene du oppfyller">
                            {applicationForm.qualifications.map((it) => (
                                <Checkbox key={it.id} value={it.label} name="qualification">
                                    {it.label}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    )}
                </section>
            )}

            {isMultipleQuestions ? (
                <ScreeningQuestions
                    questions={applicationForm.questions}
                    questionAnswerErrors={localSummary.answers}
                    onAnswerChange={(qId) => setAnswerErrorAsFixed(qId)}
                />
            ) : (
                <section className="mb-10">
                    <Heading level="2" size="medium" spacing>
                        Hvorfor du er den rette for jobben
                    </Heading>
                    <ReadMore header="Hvordan skrive en god begrunnelse?" className="mb-4">
                        <BodyLong className="mb-4">
                            Vis hvorfor du er et trygt valg for denne jobben. Fortell om arbeidserfaring,
                            praksisplasser, utdanning, frivillig arbeid, verv eller annen relevant erfaring.
                        </BodyLong>
                        <BodyLong>
                            Tenk gjerne litt utradisjonelt og husk at personlige egenskaper kan være avgjørende.
                        </BodyLong>
                    </ReadMore>
                    <Textarea
                        id="new-application-motivation"
                        label="Skriv en begrunnelse"
                        name="motivation"
                        value={motivation}
                        onChange={(e) => {
                            setMotivation(e.target.value);
                            setErrorAsFixed("motivation");
                        }}
                        maxLength={MOTIVATION_MAX_LENGTH}
                        error={!fixedErrors.includes("motivation") && validationErrors.motivation}
                    />
                </section>
            )}

            <section className="mb-10">
                <Heading level="2" size="medium" spacing>
                    Din kontaktinformasjon
                </Heading>
                <BodyLong className="mb-4">Vær nøye med å oppgi riktig informasjon.</BodyLong>

                <TextField
                    label="Navn"
                    id="new-application-name"
                    auto-complete="name"
                    name="fullName"
                    className="mb-4"
                />

                <TextField
                    label="E-post"
                    description="Må fylles ut"
                    type="text"
                    name="email"
                    auto-complete="email"
                    aria-required="true"
                    id="new-application-email"
                    onChange={() => {
                        setErrorAsFixed("email");
                    }}
                    error={!fixedErrors.includes("email") && validationErrors.email}
                    className="mb-4"
                />

                <TextField
                    label="Telefonnummer"
                    description="Må fylles ut"
                    id="new-application-telephone"
                    type="tel"
                    name="telephone"
                    auto-complete="tel"
                    aria-required="true"
                    onChange={() => {
                        setErrorAsFixed("telephone");
                    }}
                    error={!fixedErrors.includes("telephone") && validationErrors.telephone}
                />
            </section>
            <BodyLong spacing>
                Når du har sendt søknaden, kan bedriften se begrunnelsen din og hvilke kvalifikasjoner du har huket av,
                samt navnet ditt dersom du har oppgitt det. Hvis bedriften ønsker å kontakte deg, får de også se
                kontaktinformasjonen din.
            </BodyLong>
            <BodyLong spacing>Du kan når som helst trekke tilbake søknaden din.</BodyLong>
            <BodyLong spacing>
                <AkselNextLink href="/personvern-superrask-soknad" target="_blank" rel="noopener noreferrer">
                    Les om hvordan vi behandler dine data (åpner i ny fane)
                </AkselNextLink>
            </BodyLong>
            {error && <ApiErrorMessage apiErrorCode={error} />}

            <FormButtonBar id={ad.id} isPending={isPending} />
        </form>
    );
}

export default Form;

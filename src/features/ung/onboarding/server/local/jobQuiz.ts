import "server-only";
import type { JobQuiz } from "@/features/ung/onboarding/domain/jobQuiz";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

/** Jobbquizen på /jobbquiz ligger lokalt, også i live-modus. Webform-quizen i artiklene hentes fra API-et. */
export const jobQuiz: JobQuiz = {
    id: "jobbquizen",
    title: "Jobbquizen!",
    intro: "Svar riktig eller galt på påstandene og finn ut hva du kan om jobbsøking.",
    sections: [
        {
            id: "quiz-section-find-job",
            title: "Finn jobb",
            questions: [
                {
                    id: "quiz-question-apply-without-all-requirements",
                    statement: "Du bør søke på jobber selv om du ikke oppfyller alle kravene i annonsen.",
                    options: [
                        { id: "quiz-option-apply-without-all-requirements-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-apply-without-all-requirements-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "Klart du kan søke!",
                        html: sanitizeSharedContentHtml(
                            "<p>Start med å kartlegge hva du er god på og hva du vil jobbe med. Begynn å søke – selv om du ikke oppfyller alle krav. Mange arbeidsgivere er mer fleksible enn kravlisten tilsier.</p>",
                        ),
                        href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-jobs-always-advertised",
                    statement: "Den beste jobben finnes alltid i en stillingsannonse på nav.no eller finn.no.",
                    options: [
                        { id: "quiz-option-jobs-always-advertised-true", label: "Riktig", isCorrect: false },
                        { id: "quiz-option-jobs-always-advertised-false", label: "Galt", isCorrect: true },
                    ],
                    feedback: {
                        title: "Ikke alltid!",
                        html: sanitizeSharedContentHtml(
                            "<p>nav.no, finn.no og bedrifters egne nettsider er gode startpunkter. Men den beste jobben finnes ofte ikke i en utlysning – den finnes ved å ta kontakt direkte med arbeidsgivere du er interessert i.</p>",
                        ),
                        href: "/stillinger?v=5",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-apprenticeship-vigo",
                    statement: "Lærlingplasser i videregående søkes via Vigo.no.",
                    options: [
                        { id: "quiz-option-apprenticeship-vigo-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-apprenticeship-vigo-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "Riktig!",
                        html: sanitizeSharedContentHtml(
                            "<p>En lærlingplass er en toårig opplæring i en bedrift kombinert med teori fra skolen. Du søker via Vigo.no og inntaket skjer på våren. Snakk med rådgiver på skolen din for mer informasjon.</p>",
                        ),
                        href: "https://www.vigo.no/",
                        linkLabel: "Les mer om dette",
                    },
                },
            ],
        },
        {
            id: "quiz-section-application",
            title: "Søknad og CV",
            questions: [
                {
                    id: "quiz-question-cv-length",
                    statement: "En god CV bør være maks to sider lang.",
                    options: [
                        { id: "quiz-option-cv-length-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-cv-length-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "To sider er nok!",
                        html: sanitizeSharedContentHtml(
                            "<p>En god CV inneholder kontaktinfo, utdanning, eventuell erfaring, inkludert frivillig arbeid, og en kort personlig beskrivelse. Hold den ryddig og maks to sider – rekrutterere bruker bare noen sekunder på hvert ark.</p>",
                        ),
                        href: "/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-same-application",
                    statement: "Du bør sende den samme søknaden til alle arbeidsgivere for å spare tid.",
                    options: [
                        { id: "quiz-option-same-application-true", label: "Riktig", isCorrect: false },
                        { id: "quiz-option-same-application-false", label: "Galt", isCorrect: true },
                    ],
                    feedback: {
                        title: "Tilpass søknaden!",
                        html: sanitizeSharedContentHtml(
                            "<p>En god søknad er ikke generisk – den er skrevet for akkurat den jobben. Les utlysningen nøye, finn nøkkelordene og vis at du forstår hva arbeidsgiveren trenger. Én tilpasset søknad slår ti kopier.</p>",
                        ),
                        href: "/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-no-experience",
                    statement: "Uten arbeidserfaring har du ingenting å tilby en arbeidsgiver.",
                    options: [
                        { id: "quiz-option-no-experience-true", label: "Riktig", isCorrect: false },
                        { id: "quiz-option-no-experience-false", label: "Galt", isCorrect: true },
                    ],
                    feedback: {
                        title: "Du har mye å tilby!",
                        html: sanitizeSharedContentHtml(
                            "<p>Selv uten arbeidserfaring har du mye å tilby. Fokuser på personlige egenskaper, frivillig arbeid, skoleprosjekter og hva du er motivert for å lære. Vær konkret og ærlig – det setter arbeidsgivere pris på.</p>",
                        ),
                        href: "/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore",
                        linkLabel: "Les mer om dette",
                    },
                },
            ],
        },
        {
            id: "quiz-section-interview",
            title: "Intervju",
            questions: [
                {
                    id: "quiz-question-research-company",
                    statement: "Det er lurt å lese seg opp på bedriften før du møter til jobbintervju.",
                    options: [
                        { id: "quiz-option-research-company-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-research-company-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "Forberedelse er alt!",
                        html: sanitizeSharedContentHtml(
                            "<p>Les deg opp på bedriften, øv på de vanligste spørsmålene og planlegg hva du vil si om deg selv. Husk: intervjuet er også din sjanse til å vurdere om arbeidsplassen passer for deg.</p>",
                        ),
                        href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-only-employer-asks",
                    statement: "I et jobbintervju er det bare arbeidsgiveren som stiller spørsmål.",
                    options: [
                        { id: "quiz-option-only-employer-asks-true", label: "Riktig", isCorrect: false },
                        { id: "quiz-option-only-employer-asks-false", label: "Galt", isCorrect: true },
                    ],
                    feedback: {
                        title: "Det er en toveis samtale!",
                        html: sanitizeSharedContentHtml(
                            "<p>Et godt intervju er en toveis samtale. Å stille gjennomtenkte spørsmål viser at du er interessert og har tenkt gjennom jobben – og det gir deg viktig informasjon om arbeidsplassen du vurderer.</p>",
                        ),
                        href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-plan-travel",
                    statement: "Det er lurt å planlegge reisen slik at du ankommer litt før intervjuet starter.",
                    options: [
                        { id: "quiz-option-plan-travel-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-plan-travel-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "Kom litt tidlig!",
                        html: sanitizeSharedContentHtml(
                            "<p>Sjekk når du skal møte, hvor du skal være og om du trenger spesielle klær. Finn ut hvordan du kommer deg dit, og planlegg reisen slik at du kommer litt før – det gir deg ro til å samle tankene.</p>",
                        ),
                        href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                        linkLabel: "Les mer om dette",
                    },
                },
            ],
        },
        {
            id: "quiz-section-rights",
            title: "Rettigheter",
            questions: [
                {
                    id: "quiz-question-written-contract",
                    statement: "Alle arbeidstakere har rett til en skriftlig arbeidsavtale.",
                    options: [
                        { id: "quiz-option-written-contract-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-written-contract-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "Du har krav på skriftlig avtale!",
                        html: sanitizeSharedContentHtml(
                            "<p>En arbeidsavtale skal alltid være skriftlig og inneholde stillingstittel, lønn, arbeidstid og oppsigelsesfrister. Signer aldri noe du ikke forstår – be om tid til å lese gjennom avtalen.</p>",
                        ),
                        href: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/barn-og-ungdom-i-arbeid/",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-unlimited-hours",
                    statement: "I Norge kan en arbeidsgiver be deg jobbe ubegrenset mange timer uten ekstra betaling.",
                    options: [
                        { id: "quiz-option-unlimited-hours-true", label: "Riktig", isCorrect: false },
                        { id: "quiz-option-unlimited-hours-false", label: "Galt", isCorrect: true },
                    ],
                    feedback: {
                        title: "Du har krav på overtidsbetaling!",
                        html: sanitizeSharedContentHtml(
                            "<p>Normal arbeidstid er 40 timer i uken, men de fleste jobber 37,5 timer. Arbeid utover dette er overtid og skal betales ekstra. Under 18 år gjelder egne og strengere regler for arbeidstid.</p>",
                        ),
                        href: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/barn-og-ungdom-i-arbeid/",
                        linkLabel: "Les mer om dette",
                    },
                },
                {
                    id: "quiz-question-under-18-rules",
                    statement: "Under 18 år gjelder egne regler for hvor mye du kan jobbe.",
                    options: [
                        { id: "quiz-option-under-18-rules-true", label: "Riktig", isCorrect: true },
                        { id: "quiz-option-under-18-rules-false", label: "Galt", isCorrect: false },
                    ],
                    feedback: {
                        title: "Egne regler for unge!",
                        html: sanitizeSharedContentHtml(
                            "<p>Under 18 kan du jobbe i butikk, restaurant, på lager eller som avisbud. Det er regler for hvor mange timer og hvilke tider du kan jobbe – arbeidsgiver er ansvarlig for å følge disse reglene.</p>",
                        ),
                        href: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/barn-og-ungdom-i-arbeid/",
                        linkLabel: "Les mer om dette",
                    },
                },
            ],
        },
    ],
};

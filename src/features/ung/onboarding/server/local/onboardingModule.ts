import type { OnboardingModule } from "@/features/ung/onboarding/domain/onboarding";

/**
 * Onboarding-spørsmålene ligger lokalt, også i live-modus, fordi Shared Content ikke har en onboarding-kontrakt.
 * Svar-ID-ene brukes i URL-en (`svar=`) og i termMapping.server.ts, så de må ikke endres uten å oppdatere begge.
 */
export const onboardingModule: OnboardingModule = {
    id: "enklere-vei-til-jobb",
    title: "Hva passer best for deg akkurat nå?",
    intro: "Velg det som ligner mest på situasjonen din, så viser vi innhold som kan passe.",
    resultTitle: "Jobb for deg",
    resultIntro: "Her finner du stillinger og tips som passer situasjonen din.",
    questions: [
        {
            id: "question-age",
            title: "Hvor gammel er du?",
            description: "Vi bruker denne informasjonen til å gi deg bedre anbefalinger.",
            selectionMode: "single",
            options: [
                { id: "age-under-18", label: "Under 18 år" },
                { id: "age-18-or-older", label: "18 år eller eldre" },
            ],
        },
        {
            id: "question-situation",
            title: "Hva er din situasjon nå?",
            description: "Dette hjelper oss å tilpasse innholdet for deg.",
            selectionMode: "single",
            options: [
                { id: "situation-no-experience", label: "Jeg har aldri hatt jobb" },
                {
                    id: "situation-some-experience",
                    label: "Jeg har litt erfaring fra deltid, frivillighet eller sommerjobb",
                },
                { id: "situation-looking-for-change", label: "Jeg har jobbet, men søker noe nytt" },
            ],
        },
        {
            id: "question-goals",
            title: "Hva er viktigst for deg nå?",
            description: "Velg ett eller flere alternativer.",
            selectionMode: "multiple",
            options: [
                { id: "goal-find-job", label: "Finne en jobb" },
                { id: "goal-apply", label: "Søke på en stilling" },
                { id: "goal-interview", label: "Forberede meg til intervju" },
                { id: "goal-rights", label: "Forstå rettighetene mine som arbeidstaker" },
                { id: "goal-support", label: "Få hjelp og støtte" },
            ],
        },
    ],
};

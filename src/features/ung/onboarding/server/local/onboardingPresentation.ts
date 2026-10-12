/**
 * Shared Content leverer ikke resultattekster for onboardingen, så tittel og ingress til
 * resultatsida ligger lokalt her. Selve spørsmålene kommer fra Webformen (se
 * buildOnboardingModule.server.ts), ikke herfra.
 */
export const onboardingPresentation = {
    resultTitle: "Jobb for deg",
    resultIntro: "Her finner du stillinger og tips som passer situasjonen din.",
} as const;

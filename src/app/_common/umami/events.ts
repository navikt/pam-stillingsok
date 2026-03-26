import type { VariantKey, ExperimentConversion } from "@/app/_experiments/types";
import type { ExperimentKey } from "@/app/_experiments/experiments";

export type FavorittPlassering =
    | "stillingsøk-resultatliste"
    | "min-side-favoritter"
    | "lignende-annonser"
    | "annonse-side";
export type CookieBannerVariant = "A" | "B";

/**
 * Her definerer vi alle event-typer som kan sendes til Umami.
 * Navnet på eventet er nøkkelen i objektet, og verdien er typen.
 * Navn bør følge mønsteret "[Handling] - [Beskrivende element]"
 * eksempler:
 * "Søk – antall treff per side endret"
 * "Klikk - Lignende annonser"
 */
export type Events = {
    "Ung - klikket lenke til stillingssøk": undefined;
    "Klikk - Forside promo ung og vil jobbe": undefined;

    "Klikk - Forside CTA": {
        ctaId: "sok-etter-jobber" | "sommerjobb" | "sommerjobb-banner" | "hjelp-til-jobbsok";
        ctaLabel: string;
        href: string;
        /**
         * hero = øverste promotert område på siden
         * inline = inne i hovedinnholdet
         * bottom = etter hovedinnholdet
         */
        location: "hero" | "inline" | "bottom";
    };
    "Klikk - Forside flyktningbanner": {
        bannerId: "jobb-i-norge-for-ukrainske-flyktninger";
        linkId: "english" | "ukrainian" | "russian";
        linkLabel: string;
        href: string;
        language: "en" | "uk" | "ru";
        placement: "frontpage-banner";
    };

    /** Klikk på lenke til karriereveiledning fra forsiden */
    "Forside klikk karriereveiledning": undefined;

    /** UTM-registrering når vi oppdager/oppdaterer utm-parametre */
    utm: { source: string; campaign: string };

    // Denne kunne kanskje bare vært "Klikk på feedback-knapp" med et "location" som skiller på feedback?
    "Klikk min side feedback": {
        value: "Mye" | "Lite" | "Vet ikke"; // "Ja" | "Nei" osv
        questionId?: "helpfulness_v1"; // lås ID så du kan endre tekst senere uten å brekke rapporter
        location?: "min_side" | "søk" | "artikkel";
        ui?: "buttons" | "radio";
    };

    "Søk – antall treff per side endret": {
        from: number;
        to: number;
        pageBefore: number;
        pageAfter: number;
    };

    "Søk – null treff": {
        searchParams: Record<string, string[]>;
    };

    "Cookiebanner – Godta alle": {
        variant: CookieBannerVariant;
        url: string;
    };

    "Klikk - Lignende annonser": {
        adId: string;
        position: number;
        score: number;
        title: string;
        jobTitle: string;
        employer: string;
        location: string;
        href: string;
    };

    "lagre favoritt": {
        title: string;
        adId: string;
        harSamtykket?: boolean;
        erInnlogget?: boolean;
        plassering: FavorittPlassering;
        index?: number;
        page?: number;
    };
    "fjern favoritt": {
        title: string;
        adId: string;
        plassering: FavorittPlassering;
        index?: number;
        page?: number;
    };

    "logg inn for å lagre favoritt": {
        title: string;
        adId: string;
        plassering: FavorittPlassering;
    };
    "avbryt lagre favoritt": {
        title: string;
        adId: string;
        plassering: FavorittPlassering;
    };
    "Scrolled 80%": {
        page: string;
        title: string;
    };
    "sett bunnen av annonseteksten": {
        flowId: string;
        adId: string;
        tidSynligMs: number;
    };
    "tid på stilling": {
        flowId: string;
        adId: string;
        tidTotalMs: number;
        tidAktivMs: number;
    };

    /**
     * Brukes når brukeren faktisk ser en variant (eksponering).
     * Dedupe på klientsiden for å unngå spam.
     */
    "AB - eksponering": {
        experiment: ExperimentKey;
        variant: VariantKey;
        location?: string;
        type: "rendered" | "viewed";
    };

    /**
     * Brukes når bruker gjør en relevant handling (konvertering).
     */
    "AB - konvertering": {
        experiment: ExperimentKey;
        variant: VariantKey;
        konvertering: ExperimentConversion;
        location?: string;
    };

    "Klikk - video": {
        articleSlug: string;
        videoId: string;
        videoTitle: string;
        section: "ung" | "superrask" | "soek" | "jobbsoker" | "arbeidsgiver";
        location: "hero" | "inline";
        trigger: "play";
    };
    "Klikk - Ung artikkel CTA": {
        articleSlug: string;
        ctaId: string;
        ctaLabel: string;
        destination: string;
        href: string;
    };
    // TODO: flere eventtyper her
};

export type EventName = keyof Events;
export type EventPayload<N extends EventName> = Events[N];

type NamesWithEmptyPayload = {
    [K in EventName]: keyof EventPayload<K> extends never ? K : never;
}[EventName];

export type OptionalPayloadName = Exclude<NamesWithEmptyPayload, never>;

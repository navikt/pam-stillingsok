import type { ExperimentKey } from "@/app/_experiments/experiments";
import type { ExperimentConversion, VariantKey } from "@/app/_experiments/types";

export type FavorittPlassering =
    | "stillingsøk-resultatliste"
    | "min-side-favoritter"
    | "lignende-annonser"
    | "annonse-side";

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

    "Søk - la til filter": { filterGroup: string };

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

    "Klikk - Ung CTA": {
        ctaId:
            | "sommerjobb"
            | "under-18"
            | "uten-krav-til-erfaring"
            | "artikkel-5-tips-sommerjobb"
            | "artikkel-blitt-ghosta-av-arbeidsgiver";
        ctaLabel: string;
        href: string;
        location: "hero" | "inline" | "bottom";
    };

    /** Klikk på lenke til KarriereveiledningNo og UtdanningNo fra forsiden */
    "Klikk - Forside KarriereveiledningNo": undefined;
    "Klikk - Forside UtdanningNo": undefined;

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
        url: string;
    };

    "Klikk - Lignende annonser": {
        annonseId: string;
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
        annonseId: string;
        harSamtykket?: boolean;
        erInnlogget?: boolean;
        plassering: FavorittPlassering;
        index?: number;
        page?: number;
    };
    "fjern favoritt": {
        title: string;
        annonseId: string;
        plassering: FavorittPlassering;
        index?: number;
        page?: number;
    };

    "logg inn for å lagre favoritt": {
        title: string;
        annonseId: string;
        plassering: FavorittPlassering;
    };
    "avbryt lagre favoritt": {
        title: string;
        annonseId: string;
        plassering: FavorittPlassering;
    };
    "Scrolled 80%": {
        page: string;
        title: string;
    };
    "sett bunnen av annonseteksten": {
        flowId: string;
        annonseId: string;
        tidSynligMs: number;
    };
    "tid på stilling": {
        flowId: string;
        annonseId: string;
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
    "Sent - Superrask søknad": {
        annonseId: string;
        selectedQualifications: number;
        totalQualifications: number;
        motivationLength: number;
    };
    Stillingsvisning: {
        annonseId: string;

        // om arbeidsgiver
        employer: string;
        orgNumber: string;
        postalCode: number;
        city: string;
        county: string;
        country: string;

        // om annonsen
        adtextFormat: string;
        hasSuperrask: boolean;
        applicationTypes: string;
        engagementtype: string;
        extent: string;
        jobpercentage: string;
        jobpercentagerange: string;
        jobtitle: string;
        remote: string;
        sector: string;
        workday: string;
        workhours: string;
        workLanguage: string;
        source: string;
        status: string;
        title: string;

        // KI verdier
        ai_competences: string;
        ai_isUnder18: boolean;
        ai_isSummerJob: boolean;
        ai_shortSummary: string;
        ai_remote: string;
        ai_workExperience: string;
    };
    "Søkehjelper - valgte jobbtype": {
        jobbtype: string;
    };
    "Søkehjelper - valgte sted": {
        sted: string;
    };
    "Søkehjelper - valgte yrke": {
        yrke: string;
    };
    "Søkehjelper - klikket se ledige jobber": {
        jobbtype: string;
        sted: string;
        yrke: string;
    };
    "Søkehjelper V2 - klikket se ledige jobber": {
        jobbtype: string;
        sted: string;
        yrke: string;
    };
    // TODO: flere eventtyper her
};

export type EventName = keyof Events;
export type EventPayload<N extends EventName> = Events[N];

type NamesWithEmptyPayload = {
    [K in EventName]: keyof EventPayload<K> extends never ? K : never;
}[EventName];

export type OptionalPayloadName = Exclude<NamesWithEmptyPayload, never>;
export type TrackArgsFor<Name extends EventName> = Events[Name] extends undefined
    ? readonly [name: Name]
    : readonly [name: Name, payload: Events[Name]];

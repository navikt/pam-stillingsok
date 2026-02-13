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
    };
    "fjern favoritt": {
        title: string;
        adId: string;
        plassering: FavorittPlassering;
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
        kontekst: string;
        side: string;
        flowId: string;
        adId: string;
        tidSynligMs: number;
    };
    "tid på stilling": {
        kontekst: string;
        side: string;
        flowId: string;
        adId: string;
        tidTotalMs: number;
        tidAktivMs: number;
    };

    // TODO: flere eventtyper her
};

export type EventName = keyof Events;
export type EventPayload<N extends EventName> = Events[N];

type NamesWithEmptyPayload = {
    [K in EventName]: keyof EventPayload<K> extends never ? K : never;
}[EventName];

export type OptionalPayloadName = Exclude<NamesWithEmptyPayload, never>;

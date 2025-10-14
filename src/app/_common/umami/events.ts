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
    };

    // TODO: flere eventtyper her
};

export type EventName = keyof Events;
export type EventPayload<N extends EventName> = Events[N];

type NamesWithEmptyPayload = {
    [K in EventName]: keyof EventPayload<K> extends never ? K : never;
}[EventName];

export type OptionalPayloadName = Exclude<NamesWithEmptyPayload, never>;

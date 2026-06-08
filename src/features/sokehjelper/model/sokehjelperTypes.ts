export type JobbType = "sommerjobb" | "deltid" | "foerste-jobb" | "hjemmekontor" | "vet-hva-jeg-vil" | "usikker";

export type StedsValg = "hele-landet" | "hjemmekontor" | "sted";

export type YrkeKategori = "butikk" | "helse" | "restaurant" | "transport" | "it" | "skole" | "annet";

export type WizardState = {
    readonly jobbtype: JobbType | null;
    readonly sted: StedsValg | null;
    readonly county: string | null;
    readonly yrke: YrkeKategori | null;
    readonly fritekst: string;
    readonly aktivtSteg: 1 | 2 | 3 | 4;
};

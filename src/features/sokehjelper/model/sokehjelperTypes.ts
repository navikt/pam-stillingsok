export type JobbType = "sommerjobb" | "deltid" | "foerste-jobb" | "bytte-jobb" | "superrask";

export type StedsValg = "hele-landet" | "hjemmekontor" | "sted";

export type StedsValgV2 = "hjemmekontor";

export type YrkeKategori = "butikk" | "helse" | "restaurant" | "transport" | "it" | "skole" | "annet";

export type StegHandle = {
    readonly submit: () => void;
};

export type WizardState = {
    readonly jobbtypes: JobbType[];
    readonly steder: StedsValg[];
    readonly county: string | null;
    readonly yrker: YrkeKategori[];
    readonly fritekst: string;
    readonly aktivtSteg: 1 | 2 | 3 | 4;
};

export type ChipsState = {
    readonly jobbtypes: JobbType[];
    readonly steder: StedsValgV2[];
    readonly county: string | null;
    readonly yrker: YrkeKategori[];
    readonly fritekst: string;
};

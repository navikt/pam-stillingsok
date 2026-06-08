import type { JobbType, StedsValg, YrkeKategori } from "./sokehjelperTypes";

export const OCCUPATION_MAP: Record<Exclude<YrkeKategori, "annet">, string> = {
    helse: "Helse og sosial",
    butikk: "Salg og service",
    skole: "Utdanning",
    restaurant: "Reiseliv og mat",
    transport: "Transport og lager",
    it: "IT",
} as const;

export const WIZARD_COUNTIES = [
    { key: "OSLO", label: "Oslo" },
    { key: "AKERSHUS", label: "Akershus" },
    { key: "ØSTFOLD", label: "Østfold" },
    { key: "BUSKERUD", label: "Buskerud" },
    { key: "INNLANDET", label: "Innlandet" },
    { key: "VESTFOLD", label: "Vestfold" },
    { key: "TELEMARK", label: "Telemark" },
    { key: "AGDER", label: "Agder" },
    { key: "ROGALAND", label: "Rogaland" },
    { key: "VESTLAND", label: "Vestland" },
    { key: "MØRE OG ROMSDAL", label: "Møre og Romsdal" },
    { key: "TRØNDELAG", label: "Trøndelag" },
    { key: "NORDLAND", label: "Nordland" },
    { key: "TROMS", label: "Troms" },
    { key: "FINNMARK", label: "Finnmark" },
] as const;

export type CountyKey = (typeof WIZARD_COUNTIES)[number]["key"];

export type JobbTypeOption = {
    readonly value: JobbType;
    readonly label: string;
};

export const JOBBTYPE_OPTIONS: readonly JobbTypeOption[] = [
    { value: "sommerjobb", label: "Sommerjobb" },
    { value: "deltid", label: "Deltidsjobb" },
    { value: "foerste-jobb", label: "Første jobb / lite erfaring" },
    { value: "hjemmekontor", label: "Jobb med hjemmekontor" },
    { value: "usikker", label: "Jeg er usikker" },
    { value: "vet-hva-jeg-vil", label: "Jeg vet hva jeg vil søke på" },
] as const;

export type YrkeKategoriOption = {
    readonly value: YrkeKategori;
    readonly label: string;
};

export const YRKE_OPTIONS: readonly YrkeKategoriOption[] = [
    { value: "helse", label: "Helse og omsorg" },
    { value: "butikk", label: "Butikk og kundeservice" },
    { value: "skole", label: "Barnehage og skole" },
    { value: "restaurant", label: "Restaurant, kafé og hotell" },
    { value: "transport", label: "Lager, transport og logistikk" },
    { value: "it", label: "IT og teknologi" },
    { value: "annet", label: "Annet / skriv selv" },
] as const;

export type StedsValgOption = {
    readonly value: StedsValg;
    readonly label: string;
};

export const STED_OPTIONS: readonly StedsValgOption[] = [
    { value: "hele-landet", label: "Hele landet" },
    { value: "hjemmekontor", label: "Hjemmekontor" },
    { value: "sted", label: "Velg sted" },
] as const;

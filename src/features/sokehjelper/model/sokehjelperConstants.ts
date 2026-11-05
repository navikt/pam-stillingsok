import type { JobbType, YrkeKategori } from "./sokehjelperTypes";

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
    readonly emoji?: string;
};

export const JOBBTYPE_OPTIONS: readonly JobbTypeOption[] = [
    { value: "superrask", emoji: "⚡️", label: "Å søke på noe raskt!" },
    { value: "julejobb", emoji: "🎄", label: "Julejobb" },
    { value: "deltid", emoji: "🤠", label: "Deltidsjobb" },
    { value: "foerste-jobb", emoji: "🥥", label: "Min første jobb" },
    { value: "bytte-jobb", label: "Jeg vil bytte jobb" },
] as const;

export type YrkeKategoriOption = {
    readonly value: YrkeKategori;
    readonly label: string;
    readonly emoji?: string;
};

export const YRKE_OPTIONS: readonly YrkeKategoriOption[] = [
    { value: "helse", emoji: "🩹️", label: "Helse og omsorg" },
    { value: "butikk", emoji: "🛒", label: "Butikk og kundeservice" },
    { value: "skole", emoji: "🧑‍🏫", label: "Barnehage og skole" },
    { value: "restaurant", emoji: "☕️", label: "Restaurant, kafé og hotel" },
    { value: "transport", emoji: "🚛", label: "Lager, transport og logistikk" },
    { value: "it", emoji: "👾", label: "IT og teknologi" },
    { value: "annet", label: "Noe annet (skriv selv)" },
] as const;

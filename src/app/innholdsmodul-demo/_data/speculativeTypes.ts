/**
 * ⚠️ SPEKULATIBVE TYPER — IKKE BEKREFTET MOT EKTE API
 *
 * Disse typene er basert utelukkende på beskrivelser av moduler som er
 * planlagt levert av Karriere-API-et. Feltnavn og datastruktur er gjettet
 * basert på Drupal JSON:API-mønstre fra bekreftet kode.
 *
 * Ingen av typene her er verifisert mot ekte API-respons.
 * De vil sannsynligvis endres når API-dokumentasjon foreligger.
 */

import type { Paragraph } from "./types";

export type CtaParagraph = {
    type: "paragraph--cta";
    id: string;
    title: string;
    description: string;
    href: string;
    linkText: string;
};

export type CtaGridParagraph = {
    type: "paragraph--cta_grid";
    id: string;
    heading?: string;
    items: Array<{ title: string; description: string; href: string; linkText: string }>;
};

export type BannerParagraph = {
    type: "paragraph--banner";
    id: string;
    title: string;
    body: string;
    linkHref?: string;
    linkText?: string;
};

export type NoticeBlockParagraph = {
    type: "paragraph--notice_block";
    id: string;
    variant: "info" | "warning" | "error" | "success";
    title?: string;
    body: string;
};

export type SituationsCardsParagraph = {
    type: "paragraph--situations_cards";
    id: string;
    heading?: string;
    items: Array<{ title: string; description: string; href: string }>;
};

export type QuizParagraph = {
    type: "paragraph--quiz";
    id: string;
    title: string;
    questions: Array<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation?: string;
    }>;
};

export type SpeculativeParagraph =
    | CtaParagraph
    | CtaGridParagraph
    | BannerParagraph
    | NoticeBlockParagraph
    | SituationsCardsParagraph
    | QuizParagraph;

/** Union av bekreftede og spekulatibve typer — kun til bruk i komplett-demoen */
export type KomplettParagraph = Paragraph | SpeculativeParagraph;

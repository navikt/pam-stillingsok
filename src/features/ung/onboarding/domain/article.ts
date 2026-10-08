import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

export type SharedContentImage = Readonly<{
    src: string;
    alt: string;
    width: number;
    height: number;
}>;

/**
 * Menneskelesbare metadata-navn for verifisering under utvikling, f.eks. i en debug-panel på
 * artikkelsida. Termer uten tilgang (meta.omitted i Drupal) utelates i stedet for å feile,
 * og telles i omittedCount slik at panelet kan vise at noe mangler tilgang.
 */
export type ArticleMetadataNames = Readonly<{
    owner?: string;
    availableTo: readonly string[];
    audiences: readonly string[];
    age: readonly string[];
    experience: readonly string[];
    omittedCount: number;
}>;

export type ArticleBlock =
    | Readonly<{
          id: string;
          type: "rich-text";
          html: SanitizedHtml;
      }>
    | Readonly<{
          id: string;
          type: "heading";
          text: string;
          number?: string;
      }>
    | Readonly<{
          id: string;
          type: "accordion";
          style: "primary" | "secondary";
          items: readonly Readonly<{
              id: string;
              title: string;
              html: SanitizedHtml;
          }>[];
      }>
    | Readonly<{
          id: string;
          type: "title-text-image";
          title: string;
          layout: "left" | "right";
          style: "simple" | "coloured-box";
          html?: SanitizedHtml;
          link?: Readonly<{ href: string; label: string }>;
          image?: SharedContentImage;
      }>
    | Readonly<{
          id: string;
          type: "video";
          provider: "vimeo";
          title: string;
          href: string;
          /** Thumbnail fra Drupal (CMS-origin, ikke Vimeo). Kan mangle selv om relasjonen finnes. */
          thumbnailSrc?: string;
      }>
    | Readonly<{
          id: string;
          type: "spacer";
      }>;

export type Article = Readonly<{
    id: string;
    title: string;
    intro: string;
    blocks: readonly ArticleBlock[];
    webformId?: string;
    metadataNames?: ArticleMetadataNames;
}>;

export type ArticleQuizOption = Readonly<{
    id: string;
    label: string;
    isCorrect: boolean;
    feedbackHtml: SanitizedHtml;
}>;

export type ArticleQuizQuestion = Readonly<{
    id: string;
    statement: string;
    options: readonly ArticleQuizOption[];
}>;

export type ArticleQuiz = Readonly<{
    questions: readonly ArticleQuizQuestion[];
}>;

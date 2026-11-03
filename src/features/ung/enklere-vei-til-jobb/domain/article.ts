import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

export type SharedContentImage = Readonly<{
    src: string;
    alt: string;
    width: number;
    height: number;
}>;

export type ArticleHeadingLevel = "2" | "3" | "4";

export type ArticleHeading = Readonly<{
    text: string;
    level: ArticleHeadingLevel;
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
          level: ArticleHeadingLevel;
          number?: string;
      }>
    | Readonly<{
          id: string;
          type: "accordion";
          style: "primary" | "secondary";
          heading?: ArticleHeading;
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
          headingLevel: ArticleHeadingLevel;
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
          heading?: ArticleHeading;
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

export type ArticleQuizTheme = "rose" | "peach" | "mint" | "lavender";

export type ArticleQuizSection = Readonly<{
    id: string;
    title?: string;
    theme?: ArticleQuizTheme;
    questions: readonly ArticleQuizQuestion[];
}>;

export type ArticleQuiz = Readonly<{
    sections: readonly ArticleQuizSection[];
}>;

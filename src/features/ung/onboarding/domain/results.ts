import type { SharedContentImage } from "@/features/ung/onboarding/domain/article";
import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

export type ArticleResultContent = Readonly<{
    id: string;
    type: "article";
    title: string;
    description: string;
    href: string;
}>;

/** Drupal-term-ID-ene en artikkel er tagget med. Brukes til å matche artikler mot onboarding-valg. */
export type ArticleMetadata = Readonly<{
    ageTermIds: readonly string[];
    experienceTermIds: readonly string[];
    audienceTermIds: readonly string[];
}>;

/** Artikkelkort med metadata, før matching. Metadata fjernes før kortet sendes til UI-et. */
export type ArticleSummary = ArticleResultContent &
    Readonly<{
        metadata: ArticleMetadata;
    }>;

export type FaqAnswerBlock =
    | Readonly<{
          id: string;
          type: "html";
          html: SanitizedHtml;
      }>
    | Readonly<{
          id: string;
          type: "link";
          href: string;
          label: string;
      }>
    | Readonly<{
          id: string;
          type: "image";
          image: SharedContentImage;
      }>
    | Readonly<{
          id: string;
          type: "video";
          provider: "qbrick";
          mediaId: string;
          title: string;
          duration?: string;
          thumbnail?: SharedContentImage;
      }>
    | Readonly<{
          id: string;
          type: "video";
          provider: "vimeo";
          href: string;
          title: string;
          duration?: string;
          thumbnail?: SharedContentImage;
      }>
    | Readonly<{
          id: string;
          type: "related-card";
          href: string;
          title: string;
          description?: string;
          source?: string;
      }>;

export type FaqResultContent = Readonly<{
    id: string;
    type: "faq";
    question: string;
    blocks: readonly FaqAnswerBlock[];
}>;

export type ResultContent = ArticleResultContent | FaqResultContent;

export type ResultSection = Readonly<{
    id: string;
    title: string;
    content: readonly ResultContent[];
}>;

export type OnboardingResult = Readonly<{
    title: string;
    intro: string;
    sections: readonly ResultSection[];
}>;

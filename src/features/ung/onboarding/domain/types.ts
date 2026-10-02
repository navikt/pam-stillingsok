import type { SanitizedHtml } from "@/server/utils/htmlSanitizer";

export type SelectionMode = "single" | "multiple";

export type AnswerOption = Readonly<{
    id: string;
    label: string;
    description?: string;
}>;

export type OnboardingQuestion = Readonly<{
    id: string;
    title: string;
    description?: string;
    selectionMode: SelectionMode;
    options: readonly AnswerOption[];
}>;

export type OnboardingModule = Readonly<{
    id: string;
    title: string;
    intro: string;
    resultTitle: string;
    resultIntro: string;
    questions: readonly OnboardingQuestion[];
}>;

export type Selection = Readonly<{
    answerIds: readonly string[];
}>;

export type ArticleResultContent = Readonly<{
    id: string;
    type: "article";
    title: string;
    description: string;
    href: string;
}>;

export type SharedContentImage = Readonly<{
    src: string;
    alt: string;
    width: number;
    height: number;
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

export type JobQuizOption = Readonly<{
    id: string;
    label: string;
    isCorrect: boolean;
}>;

export type JobQuizFeedback = Readonly<{
    title: string;
    html: SanitizedHtml;
    href: string;
    linkLabel: string;
}>;

export type JobQuizQuestion = Readonly<{
    id: string;
    statement: string;
    options: readonly JobQuizOption[];
    feedback: JobQuizFeedback;
}>;

export type JobQuizSection = Readonly<{
    id: string;
    title: string;
    questions: readonly JobQuizQuestion[];
}>;

export type JobQuiz = Readonly<{
    id: string;
    title: string;
    intro: string;
    sections: readonly JobQuizSection[];
}>;

export type ArticleMetadata = Readonly<{
    ageTermIds: readonly string[];
    experienceTermIds: readonly string[];
    audienceTermIds: readonly string[];
}>;

export type ArticleSummary = Readonly<{
    id: string;
    title: string;
    description: string;
    href: string;
    metadata: ArticleMetadata;
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
          html?: SanitizedHtml;
          link?: Readonly<{ href: string; label: string }>;
      }>
    | Readonly<{
          id: string;
          type: "video";
          provider: "vimeo";
          title: string;
          href: string;
      }>
    | Readonly<{
          id: string;
          type: "spacer";
      }>;

export type SharedContentArticle = Readonly<{
    id: string;
    title: string;
    intro: string;
    sourceUrl?: string;
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

export type ArticleQuiz = Readonly<{
    questions: readonly ArticleQuizQuestion[];
}>;

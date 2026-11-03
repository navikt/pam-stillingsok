import type { SharedContentImage } from "@/features/ung/enklere-vei-til-jobb/domain/article";

export type ArticleResultContent = Readonly<{
    id: string;
    type: "article";
    title: string;
    description: string;
    href: string;
    /** Illustrasjon eller teaserbilde over tittelen i kortet. */
    image?: SharedContentImage;
}>;

export type ResultSection = Readonly<{
    id: string;
    title: string;
    content: readonly ArticleResultContent[];
}>;

export type OnboardingResult = Readonly<{
    title: string;
    intro: string;
    sections: readonly ResultSection[];
}>;

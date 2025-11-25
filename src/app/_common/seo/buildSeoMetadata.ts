import type { Metadata } from "next";

export type BaseSeo = {
    readonly title: string;
    readonly description?: string;
    readonly imageUrl: string;
};

export const buildSeoMetadata = (base: BaseSeo): Metadata => {
    const { title, description, imageUrl } = base;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
};

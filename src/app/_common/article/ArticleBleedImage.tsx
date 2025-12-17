import React from "react";
import Image, { ImageProps } from "next/image";
import { Bleed, BodyLong } from "@navikt/ds-react";
import { cn } from "@/app/_common/utils/cn";

type ArticleBleedImageProps = ImageProps & {
    figcaption?: string;
};
function ArticleBleedImage(props: ArticleBleedImageProps) {
    if (props.figcaption) {
        return (
            <figure className="article-image-figure mb-12">
                <Bleed marginInline={{ xs: "space-0", sm: "space-0", md: "space-96" }} className="mb-2 image-wrapper">
                    <Image {...props} className={cn("article-image", props.className)} fill quality={90} />

                    <BodyLong size="small" as="figcaption">
                        {props.figcaption}
                    </BodyLong>
                </Bleed>
            </figure>
        );
    }

    return (
        <Bleed marginInline={{ xs: "space-0", sm: "space-0", md: "space-96" }} className="mb-8 image-wrapper">
            <Image {...props} className={cn("article-image", props.className)} fill quality={90} />
        </Bleed>
    );
}

export default ArticleBleedImage;

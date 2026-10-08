"use client";

import { CaretRightFillIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";
import Image from "next/image";
import { useState } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { type EventPayload, track } from "@/app/_common/umami";
import { parseVimeoHref } from "@/app/_common/VimeoVideo/vimeoHref";
import styles from "./VimeoVideo.module.css";

type VideoFormat = "portrait" | "landscape";

function getFormatClassName(format: VideoFormat): string {
    if (format === "portrait") {
        return styles.portrait;
    }

    return styles.landscape;
}

export type VimeoVideoProps = Readonly<{
    title: string;
    /** Validert Vimeo-lenke fra API-et, f.eks. https://vimeo.com/123456789 eller https://player.vimeo.com/video/123456789 */
    href: string;
    format?: VideoFormat;
    description?: string;
    loadButtonLabel?: string;
    trackingData?: EventPayload<"Klikk - video">;
    /**
     * Thumbnail fra Drupal (CMS-origin), ikke fra Vimeo. Bildet kan mangle på fil-proxyen selv
     * om URL-en finnes, derfor skjules det ved lastefeil og faller tilbake til gradient-placeholderen.
     */
    thumbnailSrc?: string;
}>;

export default function VimeoVideo({
    title,
    href,
    description,
    loadButtonLabel = "Spill av video",
    trackingData,
    thumbnailSrc,
    format = "portrait",
}: VimeoVideoProps) {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [thumbnailFailed, setThumbnailFailed] = useState<boolean>(false);
    const parsed = parseVimeoHref(href);

    const formatClassName = getFormatClassName(format);

    if (!parsed) {
        // Usikker eller ukjent lenkeform: vis bare den rå lenken, ingen embed.
        return (
            <div className={styles.container}>
                <AkselNextLink href={href}>{title}</AkselNextLink>
            </div>
        );
    }

    const { embedSrc } = parsed;

    return (
        <figure className={styles.container}>
            <div className={`${styles.frame} ${formatClassName}`}>
                {isLoaded ? (
                    <iframe
                        className={styles.iframe}
                        title={title}
                        src={embedSrc}
                        loading="lazy"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                ) : (
                    <div className={styles.placeholder}>
                        {thumbnailSrc && !thumbnailFailed ? (
                            <Image
                                src={thumbnailSrc}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 100vw, 48rem"
                                className={styles.poster}
                                onError={() => setThumbnailFailed(true)}
                            />
                        ) : (
                            <div className={styles["poster-fallback"]} aria-hidden="true" />
                        )}
                        <div className={styles.content}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoaded(true);
                                    if (trackingData) {
                                        track("Klikk - video", trackingData);
                                    }
                                }}
                                className={styles["load-button"]}
                                aria-label={`${loadButtonLabel}: ${title}`}
                            >
                                <CaretRightFillIcon fontSize="2rem" title={loadButtonLabel} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {description && (
                <figcaption className={styles.figcaption}>
                    <BodyShort size="small">{description}</BodyShort>
                </figcaption>
            )}
        </figure>
    );
}

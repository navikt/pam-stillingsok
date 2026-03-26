"use client";

import { useState } from "react";
import styles from "./QbrickVideo.module.css";
import Image from "next/image";
import { CaretRightFillIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";

type VideoFormat = "portrait" | "landscape";

export type QbrickVideoProps = Readonly<{
    title: string;
    format?: VideoFormat;
    description?: string;
    posterUrl?: string;
    loadButtonLabel?: string;
    autoplay?: boolean;
    mediaId: string;
}>;

function getFormatClassName(format: VideoFormat): string {
    if (format === "portrait") {
        return styles["portrait"];
    }

    return styles["landscape"];
}

export default function QbrickVideo({
    title,
    format = "portrait",
    description,
    posterUrl,
    loadButtonLabel = "Spill av video",
    autoplay = true,
    mediaId,
}: QbrickVideoProps) {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const formatClassName = getFormatClassName(format);
    if (mediaId == null) {
        throw new Error("Video mangler mediaId");
    }
    const srcUrl = `https://play2.qbrick.com/qplayer/index.html?accountId=763558&mediaId=${mediaId}&configId=Enterprise&autoplay=${autoplay}`;

    return (
        <figure className={styles["container"]}>
            <div className={`${styles["frame"]} ${formatClassName}`}>
                {isLoaded ? (
                    <iframe
                        className={styles["iframe"]}
                        title={title}
                        src={srcUrl}
                        loading="lazy"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                ) : (
                    <div className={styles["placeholder"]}>
                        {posterUrl ? (
                            <Image
                                className={styles["poster"]}
                                src={posterUrl}
                                alt=""
                                aria-hidden="true"
                                fill
                                sizes={
                                    format === "portrait"
                                        ? "(max-width: 640px) 100vw, 416px"
                                        : "(max-width: 640px) 100vw, 768px"
                                }
                                quality={75}
                            />
                        ) : (
                            <div className={styles["poster-fallback"]} aria-hidden="true" />
                        )}

                        <div className={styles["content"]}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoaded(true);
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

            {description ? (
                <figcaption className={styles["figcaption"]}>
                    <BodyShort size="small">{description}</BodyShort>
                </figcaption>
            ) : null}
        </figure>
    );
}

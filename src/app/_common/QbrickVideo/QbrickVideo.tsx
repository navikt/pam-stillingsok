"use client";

import { useState } from "react";
import styles from "./QbrickVideo.module.css";
import Image from "next/image";
import { CaretRightFillIcon } from "@navikt/aksel-icons";

type VideoFormat = "portrait" | "landscape";

export type QbrickVideoProps = Readonly<{
    title: string;
    format?: VideoFormat;
    description?: string;
    transcriptUrl?: string;
    transcriptLabel?: string;
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
    transcriptUrl,
    transcriptLabel = "Les transkripsjon",
    posterUrl,
    loadButtonLabel = "Spill av video",
    autoplay = true,
    mediaId,
}: QbrickVideoProps) {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const formatClassName = getFormatClassName(format);
    if (mediaId == null) {
        throw new Error("Video manger mediaId");
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
                                preload
                                sizes={
                                    format === "portrait"
                                        ? "(max-width: 640px) 100vw, 416px"
                                        : "(max-width: 640px) 100vw, 768px"
                                }
                                quality={75}
                            />
                        ) : (
                            <div className={styles["posterFallback"]} aria-hidden="true" />
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

            {description || transcriptUrl ? (
                <figcaption className={styles["figcaption"]}>
                    {description ? <p className={styles["description"]}>{description}</p> : null}

                    {transcriptUrl ? (
                        <a className={styles["transcript-link"]} href={transcriptUrl}>
                            {transcriptLabel}
                        </a>
                    ) : null}
                </figcaption>
            ) : null}
        </figure>
    );
}

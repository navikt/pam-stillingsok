import { Accordion, Box, Detail, Heading, LinkCard, VStack } from "@navikt/ds-react";
import { AccordionContent, AccordionHeader, AccordionItem } from "@navikt/ds-react/Accordion";
import { LinkCardDescription, LinkCardFooter, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Image from "next/image";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import QbrickVideo from "@/app/_common/QbrickVideo/QbrickVideo";
import type { EventPayload } from "@/app/_common/umami";
import VimeoVideo from "@/app/_common/VimeoVideo/VimeoVideo";
import { parseVimeoHref } from "@/app/_common/VimeoVideo/vimeoHref";
import type { FaqAnswerBlock, OnboardingResult } from "@/features/ung/onboarding/domain/results";
import { SafeHtml } from "@/features/ung/onboarding/ui/SafeHtml";

type ResultContentProps = Readonly<{
    result: OnboardingResult;
}>;

export function ResultContent({ result }: ResultContentProps) {
    return (
        <VStack gap={{ xs: "space-24", md: "space-32" }}>
            {result.sections.map((section) => {
                const articles = section.content.filter((content) => content.type === "article");
                const faqs = section.content.filter((content) => content.type === "faq");

                return (
                    <VStack key={section.id} gap="space-24">
                        {articles.length > 0 && (
                            <VStack as="section" gap="space-16">
                                <Heading level="2" size="large" visuallyHidden>
                                    {section.title}
                                </Heading>

                                {articles.map((article) => (
                                    <LinkCard key={article.id} data-ung-link-card="blue">
                                        <VStack asChild gap="space-8">
                                            <LinkCardTitle as="h3">
                                                {article.image && (
                                                    <Image
                                                        src={article.image.src}
                                                        alt={article.image.alt}
                                                        width={article.image.width}
                                                        height={article.image.height}
                                                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                                    />
                                                )}
                                                <AkselNextLinkCardAnchor href={article.href}>
                                                    {article.title}
                                                </AkselNextLinkCardAnchor>
                                            </LinkCardTitle>
                                        </VStack>

                                        <LinkCardDescription>{article.description}</LinkCardDescription>
                                    </LinkCard>
                                ))}
                            </VStack>
                        )}

                        {faqs.length > 0 && (
                            <Box
                                as="section"
                                background="brand-beige-soft"
                                borderRadius="12"
                                padding={{ xs: "space-16", md: "space-24" }}
                            >
                                <VStack gap="space-16">
                                    <Heading level="2" size="large">
                                        {section.title}
                                    </Heading>
                                    {faqs.length === 1 ? (
                                        <VStack gap="space-8">
                                            <Heading level="3" size="small">
                                                {faqs[0].question}
                                            </Heading>
                                            <FaqAnswerBlocks blocks={faqs[0].blocks} />
                                        </VStack>
                                    ) : (
                                        <Accordion>
                                            {faqs.map((faq, index) => (
                                                <AccordionItem key={faq.id} defaultOpen={index === 0}>
                                                    <AccordionHeader>{faq.question}</AccordionHeader>
                                                    <AccordionContent>
                                                        <FaqAnswerBlocks blocks={faq.blocks} />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    )}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                );
            })}
        </VStack>
    );
}

function FaqAnswerBlocks({ blocks }: Readonly<{ blocks: readonly FaqAnswerBlock[] }>) {
    return (
        <VStack gap="space-16">
            {blocks.map((block) => {
                switch (block.type) {
                    case "html":
                        return <SafeHtml key={block.id} html={block.html} />;
                    case "link":
                        return (
                            <div key={block.id}>
                                <AkselNextLink href={block.href}>{block.label}</AkselNextLink>
                            </div>
                        );
                    case "image":
                        return (
                            <Box key={block.id} borderRadius="8" overflow="hidden">
                                <Image
                                    src={block.image.src}
                                    alt={block.image.alt}
                                    width={block.image.width}
                                    height={block.image.height}
                                    sizes="(max-width: 768px) calc(100vw - 64px), 528px"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </Box>
                        );
                    case "video":
                        return <VideoBlock key={block.id} block={block} />;
                    case "related-card":
                        return (
                            <LinkCard key={block.id} size="small" data-ung-link-card="blue">
                                <LinkCardTitle>
                                    <AkselNextLinkCardAnchor href={block.href}>{block.title}</AkselNextLinkCardAnchor>
                                </LinkCardTitle>
                                {block.description && <LinkCardDescription>{block.description}</LinkCardDescription>}
                                {block.source && (
                                    <LinkCardFooter>
                                        <Detail>{block.source}</Detail>
                                    </LinkCardFooter>
                                )}
                            </LinkCard>
                        );
                    default:
                        return assertNever(block);
                }
            })}
        </VStack>
    );
}

type VideoAnswerBlock = Extract<FaqAnswerBlock, { type: "video" }>;

function VideoBlock({ block }: Readonly<{ block: VideoAnswerBlock }>) {
    if (block.provider === "qbrick") {
        const format = block.thumbnail && block.thumbnail.height > block.thumbnail.width ? "portrait" : "landscape";
        const trackingData: EventPayload<"Klikk - video"> = {
            provider: "qbrick",
            videoId: block.mediaId,
            videoTitle: block.title,
            section: "ung",
            location: "inline",
            trigger: "play",
        };

        return (
            <QbrickVideo
                mediaId={block.mediaId}
                title={block.title}
                format={format}
                posterUrl={block.thumbnail?.src}
                description={block.duration ? `Video, ${block.duration}` : undefined}
                trackingData={trackingData}
            />
        );
    }

    const trackingData: EventPayload<"Klikk - video"> = {
        provider: "vimeo",
        videoId: parseVimeoHref(block.href)?.videoId ?? "ukjent",
        videoTitle: block.title,
        section: "ung",
        location: "inline",
        trigger: "play",
    };

    return (
        <VimeoVideo
            href={block.href}
            title={block.title}
            description={block.duration ? `Video, ${block.duration}` : undefined}
            trackingData={trackingData}
        />
    );
}

function assertNever(_value: never): never {
    throw new TypeError("Ukjent svarblokk");
}

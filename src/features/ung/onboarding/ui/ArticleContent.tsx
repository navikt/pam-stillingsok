import { Bleed, Box, ExpansionCard, Heading, HGrid, VStack } from "@navikt/ds-react";
import { ExpansionCardContent, ExpansionCardHeader, ExpansionCardTitle } from "@navikt/ds-react/ExpansionCard";
import { PageBlock } from "@navikt/ds-react/Page";
import Image from "next/image";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import type { EventPayload } from "@/app/_common/umami";
import VimeoVideo from "@/app/_common/VimeoVideo/VimeoVideo";
import { parseVimeoHref } from "@/app/_common/VimeoVideo/vimeoHref";
import type { ArticleBlock } from "@/features/ung/onboarding/domain/article";
import { SafeHtml } from "@/features/ung/onboarding/ui/SafeHtml";

type ArticleContentProps = Readonly<{
    blocks: readonly ArticleBlock[];
    /** Brukes bare til sporing (Umami-eventet «Klikk - video»), ikke til visning. */
    articleSlug?: string;
}>;

type HeadingBlock = Extract<ArticleBlock, { type: "heading" }>;
type AccordionBlock = Extract<ArticleBlock, { type: "accordion" }>;

type RenderGroup =
    | Readonly<{ kind: "block"; block: ArticleBlock }>
    | Readonly<{ kind: "secondary-accordion"; heading?: HeadingBlock; accordion: AccordionBlock }>;

export function ArticleContent({ blocks, articleSlug }: ArticleContentProps) {
    return (
        <VStack gap={{ xs: "space-24", md: "space-32" }}>
            {groupSecondaryAccordions(blocks).map((group) =>
                group.kind === "secondary-accordion" ? (
                    <SecondaryAccordionSection
                        key={`secondary-${group.accordion.id}`}
                        heading={group.heading}
                        accordion={group.accordion}
                    />
                ) : (
                    <ArticleBlockView
                        key={`${group.block.type}-${group.block.id}`}
                        block={group.block}
                        articleSlug={articleSlug}
                    />
                ),
            )}
        </VStack>
    );
}

/**
 * Secondary-accordions skal vises i en felles kontrastboks med overskriften rett foran, slik
 * «Vanlige spørsmål»-seksjonen er tegnet i skissen. Grupperer bare mønsteret heading umiddelbart
 * etterfulgt av en secondary accordion, slik at annet artikkelinnhold ikke flyttes inn i boksen
 * ved en feil. Mangler heading rett foran, vises accordionen fortsatt alene i kontrastboksen.
 */
function groupSecondaryAccordions(blocks: readonly ArticleBlock[]): readonly RenderGroup[] {
    const groups: RenderGroup[] = [];
    let skipNext = false;

    blocks.forEach((block, index) => {
        if (skipNext) {
            skipNext = false;
            return;
        }

        const next = blocks[index + 1];
        if (block.type === "heading" && next?.type === "accordion" && next.style === "secondary") {
            groups.push({ kind: "secondary-accordion", heading: block, accordion: next });
            skipNext = true;
            return;
        }

        if (block.type === "accordion" && block.style === "secondary") {
            groups.push({ kind: "secondary-accordion", accordion: block });
            return;
        }

        groups.push({ kind: "block", block });
    });

    return groups;
}

function SecondaryAccordionSection({
    heading,
    accordion,
}: Readonly<{ heading?: HeadingBlock; accordion: AccordionBlock }>) {
    const headingId = heading ? `accordion-heading-${heading.id}` : undefined;

    return (
        <Bleed marginInline="full" asChild>
            <Box
                as="section"
                background="brand-beige-soft"
                paddingBlock={{ xs: "space-16", md: "space-24" }}
                {...(headingId ? { "aria-labelledby": headingId } : {})}
            >
                <PageBlock width="text" gutters>
                    <VStack gap={{ xs: "space-16", md: "space-24" }}>
                        {heading && (
                            <Heading id={headingId} level="2" size="large">
                                {heading.number ? `${heading.number}. ${heading.text}` : heading.text}
                            </Heading>
                        )}
                        <AccordionBlockView accordion={accordion} />
                    </VStack>
                </PageBlock>
            </Box>
        </Bleed>
    );
}

/**
 * Hvert accordion-item rendres som en egen Aksel ExpansionCard med synlig avstand mellom
 * kortene, i stedet for Aksel Accordion.
 */
function AccordionBlockView({ accordion }: Readonly<{ accordion: AccordionBlock }>) {
    return (
        <VStack gap="space-12">
            {accordion.items.map((item) => (
                <ExpansionCard key={item.id} aria-label={item.title} size="small">
                    <ExpansionCardHeader>
                        <ExpansionCardTitle as="h2" size="small">
                            {item.title}
                        </ExpansionCardTitle>
                    </ExpansionCardHeader>
                    <ExpansionCardContent>
                        <SafeHtml html={item.html} />
                    </ExpansionCardContent>
                </ExpansionCard>
            ))}
        </VStack>
    );
}

function ArticleBlockView({ block, articleSlug }: Readonly<{ block: ArticleBlock; articleSlug?: string }>) {
    switch (block.type) {
        case "rich-text":
            return <SafeHtml html={block.html} />;
        case "heading":
            return (
                <Heading level="2" size="large">
                    {block.number ? `${block.number}. ${block.text}` : block.text}
                </Heading>
            );
        case "accordion":
            return <AccordionBlockView accordion={block} />;
        case "title-text-image": {
            const textContent = (
                <VStack gap="space-12" justify="center">
                    <Heading level="2" size="medium">
                        {block.title}
                    </Heading>
                    {block.html && <SafeHtml html={block.html} />}
                    {block.link && (
                        <div>
                            <AkselNextLink href={block.link.href}>{block.link.label}</AkselNextLink>
                        </div>
                    )}
                </VStack>
            );
            const imageContent = block.image && (
                <Box borderRadius="8" overflow="hidden">
                    <Image
                        src={block.image.src}
                        alt={block.image.alt}
                        width={block.image.width}
                        height={block.image.height}
                        sizes="(max-width: 768px) calc(100vw - 64px), 320px"
                        style={{ width: "100%", height: "auto" }}
                    />
                </Box>
            );

            return (
                <Box
                    as="section"
                    aria-label={block.title}
                    padding={{ xs: "space-16", md: "space-24" }}
                    borderRadius="8"
                    {...(block.style === "coloured-box"
                        ? {
                              background: "brand-beige-soft" as const,
                          }
                        : { background: "raised" as const })}
                >
                    {imageContent ? (
                        <HGrid gap={{ xs: "space-12", md: "space-16" }} columns={{ xs: 1, md: 2 }} align="center">
                            {block.layout === "left" ? (
                                <>
                                    {imageContent}
                                    {textContent}
                                </>
                            ) : (
                                <>
                                    {textContent}
                                    {imageContent}
                                </>
                            )}
                        </HGrid>
                    ) : (
                        textContent
                    )}
                </Box>
            );
        }
        case "video": {
            const trackingData: EventPayload<"Klikk - video"> = {
                provider: "vimeo",
                articleSlug,
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
                    trackingData={trackingData}
                    thumbnailSrc={block.thumbnailSrc}
                />
            );
        }
        case "spacer":
            return <Box aria-hidden="true" paddingBlock="space-8" />;
        default:
            return assertNever(block);
    }
}

function assertNever(_value: never): never {
    throw new TypeError("Ukjent artikkelblokk");
}

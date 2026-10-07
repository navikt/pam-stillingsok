import { Accordion, Bleed, Box, Detail, Heading, HGrid, LinkCard, VStack } from "@navikt/ds-react";
import { AccordionContent, AccordionHeader, AccordionItem } from "@navikt/ds-react/Accordion";
import { LinkCardFooter, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { PageBlock } from "@navikt/ds-react/Page";
import Image from "next/image";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import type { ArticleBlock } from "@/features/ung/onboarding/domain/article";
import { SafeHtml } from "@/features/ung/onboarding/ui/SafeHtml";

type ArticleContentProps = Readonly<{
    blocks: readonly ArticleBlock[];
}>;

type HeadingBlock = Extract<ArticleBlock, { type: "heading" }>;
type AccordionBlock = Extract<ArticleBlock, { type: "accordion" }>;

type RenderGroup =
    | Readonly<{ kind: "block"; block: ArticleBlock }>
    | Readonly<{ kind: "secondary-accordion"; heading?: HeadingBlock; accordion: AccordionBlock }>;

export function ArticleContent({ blocks }: ArticleContentProps) {
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
                    <ArticleBlockView key={`${group.block.type}-${group.block.id}`} block={group.block} />
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

function AccordionBlockView({ accordion }: Readonly<{ accordion: AccordionBlock }>) {
    return (
        <Accordion indent={false}>
            {accordion.items.map((item, index) => (
                <AccordionItem key={item.id} defaultOpen={index === 0}>
                    <AccordionHeader>{item.title}</AccordionHeader>
                    <AccordionContent>
                        <SafeHtml html={item.html} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

function ArticleBlockView({ block }: Readonly<{ block: ArticleBlock }>) {
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
                    {...(block.style === "coloured-box"
                        ? {
                              background: "neutral-soft" as const,
                              padding: { xs: "space-16", md: "space-24" } as const,
                              borderRadius: "8" as const,
                          }
                        : {})}
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
        case "video":
            return (
                <LinkCard size="small" className="bg-brand-peach-subtle">
                    <LinkCardTitle as="h2">
                        <AkselNextLinkCardAnchor href={block.href}>{block.title}</AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                    <LinkCardFooter>
                        <Detail>Video hos Vimeo</Detail>
                    </LinkCardFooter>
                </LinkCard>
            );
        case "spacer":
            return <Box aria-hidden="true" paddingBlock="space-8" />;
        default:
            return assertNever(block);
    }
}

function assertNever(_value: never): never {
    throw new TypeError("Ukjent artikkelblokk");
}

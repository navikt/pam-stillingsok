import { Accordion, Box, Detail, Heading, HGrid, LinkCard, VStack } from "@navikt/ds-react";
import { AccordionContent, AccordionHeader, AccordionItem } from "@navikt/ds-react/Accordion";
import { LinkCardFooter, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Image from "next/image";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import type { ArticleBlock } from "@/features/ung/onboarding/domain/types";
import { SafeHtml } from "@/features/ung/onboarding/ui/SafeHtml";

type ArticleContentProps = Readonly<{
    blocks: readonly ArticleBlock[];
}>;

export function ArticleContent({ blocks }: ArticleContentProps) {
    return (
        <VStack gap={{ xs: "space-24", md: "space-32" }}>
            {blocks.map((block) => (
                <ArticleBlockView key={`${block.type}-${block.id}`} block={block} />
            ))}
        </VStack>
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
            return (
                <Accordion>
                    {block.items.map((item) => (
                        <AccordionItem key={item.id}>
                            <AccordionHeader>{item.title}</AccordionHeader>
                            <AccordionContent>
                                <SafeHtml html={item.html} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            );
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

import { Heading, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Image from "next/image";
import TrackedAkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/TrackedAkselNextLinkCardAnchor";
import { trackingEvent } from "@/app/_common/umami/trackingEvent";
import type { OnboardingResult } from "@/features/ung/enklere-vei-til-jobb/domain/results";

type ResultContentProps = Readonly<{
    result: OnboardingResult;
}>;

export function ResultContent({ result }: ResultContentProps) {
    return (
        <VStack gap={{ xs: "space-24", md: "space-32" }}>
            {result.sections.map((section) => {
                return (
                    <VStack key={section.id} gap="space-24">
                        {section.content.length > 0 && (
                            <VStack as="section" gap="space-16">
                                <Heading level="2" size="large" visuallyHidden>
                                    {section.title}
                                </Heading>

                                {section.content.map((article) => (
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
                                                <TrackedAkselNextLinkCardAnchor
                                                    href={article.href}
                                                    tracking={trackingEvent("Klikk - Enklere vei til jobb", {
                                                        action: "åpne-artikkel",
                                                        location: "resultater",
                                                        elementId: article.id,
                                                        elementLabel: article.title,
                                                        articleId: article.id,
                                                    })}
                                                >
                                                    {article.title}
                                                </TrackedAkselNextLinkCardAnchor>
                                            </LinkCardTitle>
                                        </VStack>

                                        <LinkCardDescription>{article.description}</LinkCardDescription>
                                    </LinkCard>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                );
            })}
        </VStack>
    );
}

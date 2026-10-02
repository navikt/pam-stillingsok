import { BodyShort, ReadMore, VStack } from "@navikt/ds-react";
import type { ArticleMetadataNames } from "@/features/ung/onboarding/domain/article";

type ArticleMetadataDebugPanelProps = Readonly<{
    metadata: ArticleMetadataNames;
}>;

/**
 * Midlertidig verifiseringspanel som viser menneskelesbare metadata-navn fra Shared Content.
 * Ikke en del av skissa — fjernes eller skjules når teamet ikke lenger trenger å verifisere
 * at metadataene kommer riktig ut av API-et.
 */
export function ArticleMetadataDebugPanel({ metadata }: ArticleMetadataDebugPanelProps) {
    const rows: Readonly<{ label: string; value: string }>[] = [
        { label: "Redaksjonelt ansvarlig", value: metadata.owner ?? "Ikke satt" },
        { label: "Tilgjengelig for", value: formatList(metadata.availableTo) },
        { label: "Målgruppe", value: formatList(metadata.audiences) },
        { label: "Alder", value: formatList(metadata.age) },
        { label: "Erfaring", value: formatList(metadata.experience) },
    ];

    return (
        <ReadMore size="small" header="Metadata (for verifisering)">
            <VStack gap="space-8">
                {rows.map((row) => (
                    <BodyShort key={row.label} size="small">
                        {row.label}: {row.value}
                    </BodyShort>
                ))}
                {metadata.omittedCount > 0 && (
                    <BodyShort size="small">
                        {metadata.omittedCount} term(er) manglet tilgang og vises ikke her.
                    </BodyShort>
                )}
            </VStack>
        </ReadMore>
    );
}

function formatList(values: readonly string[]): string {
    return values.length > 0 ? values.join(", ") : "Ikke satt";
}

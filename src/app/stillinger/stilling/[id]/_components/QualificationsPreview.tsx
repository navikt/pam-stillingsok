import { BodyLong, Box, Heading, List } from "@navikt/ds-react";
import type { Qualification } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";

type QualificationsPreviewProps = {
    qualifications: Qualification[];
};

export default function QualificationsPreview({ qualifications }: QualificationsPreviewProps) {
    return (
        <Box borderRadius="4" padding="space-16" className="bg-brand-green-soft full-width">
            <Heading level="2" size="medium" spacing>
                Ønskede kvalifikasjoner
            </Heading>
            <List className="mb-5">
                {qualifications.map((it) => (
                    <List.Item key={it.id}>{it.label}</List.Item>
                ))}
            </List>
            <BodyLong>
                Du kan være den rette selv om du ikke oppfyller alle. Ikke la listen stoppe deg fra å søke!
            </BodyLong>
        </Box>
    );
}

import React from "react";
import { BodyShort, Box, Heading, HStack, ReadMore } from "@navikt/ds-react";
import mapFromUrlParamToJobCategories from "@/app/sommerjobb/_utils/mapFromUrlParamToJobCategories";
import { useSearchParams } from "next/navigation";
import { JOB_CATEGORY_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { SOMMERJOBB_KEYWORDS } from "@/app/sommerjobb/_utils/searchKeywords";

function DebugSearch(): JSX.Element {
    const searchParams = useSearchParams();

    return (
        <ReadMore header="Hva søkes det på?">
            <BodyShort size="small" textColor="subtle" spacing>
                Denne informasjonen er her bare mens sommerjobb-siden testes.
            </BodyShort>
            <Heading size="xsmall" spacing>
                Sommerjobber finnes med disse søkerordene:
            </Heading>
            <HStack gap="2" className="mb-4">
                {SOMMERJOBB_KEYWORDS.map((it) => (
                    <Box key={it} background="surface-info-subtle" paddingBlock="1" paddingInline="2">
                        <BodyShort size="small">{it}</BodyShort>
                    </Box>
                ))}
            </HStack>
            <Heading size="xsmall" spacing>
                Pluss en eller flere av disse:
            </Heading>
            <HStack gap="2">
                {mapFromUrlParamToJobCategories(searchParams.getAll(JOB_CATEGORY_PARAM_NAME)).length > 0 ? (
                    <>
                        {" "}
                        {mapFromUrlParamToJobCategories(searchParams.getAll(JOB_CATEGORY_PARAM_NAME)).map((it) => (
                            <Box key={it} background="surface-info-subtle" paddingBlock="1" paddingInline="2">
                                <BodyShort size="small">{it}</BodyShort>
                            </Box>
                        ))}
                    </>
                ) : (
                    <BodyShort size="small" textColor="subtle">
                        * Flere søkeord dukker opp her hvis du krysser av på kategoriene over
                    </BodyShort>
                )}
            </HStack>
        </ReadMore>
    );
}

export default DebugSearch;

import { BodyShort, Box, Button, HStack, Tag, VStack } from "@navikt/ds-react";
import Link from "next/link";
import { track } from "@/app/_common/umami";
import { buildSearchUrl } from "@/features/sokehjelper/model/buildSearchUrl";
import { JOBBTYPE_OPTIONS, WIZARD_COUNTIES, YRKE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { WizardState } from "@/features/sokehjelper/model/sokehjelperTypes";

type OppsummeringProps = {
    readonly state: WizardState;
    readonly onStartPaaNytt: () => void;
};

function getJobbtypeLabel(state: WizardState): string | null {
    if (state.jobbtype === null || state.jobbtype === "usikker" || state.jobbtype === "vet-hva-jeg-vil") {
        return null;
    }

    return JOBBTYPE_OPTIONS.find((opt) => opt.value === state.jobbtype)?.label ?? null;
}

function getStedLabel(state: WizardState): string | null {
    if (state.sted === null || state.sted === "hele-landet") {
        return null;
    }

    if (state.sted === "hjemmekontor") {
        return "Hjemmekontor";
    }

    if (state.sted === "sted" && state.county !== null) {
        return WIZARD_COUNTIES.find((c) => c.key === state.county)?.label ?? null;
    }

    return null;
}

function getYrkeLabel(state: WizardState): string | null {
    if (state.yrke === null) {
        return null;
    }

    if (state.yrke === "annet") {
        return state.fritekst.length > 0 ? state.fritekst : null;
    }

    return YRKE_OPTIONS.find((opt) => opt.value === state.yrke)?.label ?? null;
}

export default function Oppsummering({ state, onStartPaaNytt }: OppsummeringProps) {
    const searchUrl = buildSearchUrl(state);

    const jobbtype = getJobbtypeLabel(state);
    const sted = getStedLabel(state);
    const yrke = getYrkeLabel(state);

    const chips = [jobbtype, sted, yrke].filter((label): label is string => label !== null);

    return (
        <VStack gap="space-12">
            {chips.length > 0 ? (
                <Box>
                    <BodyShort weight="semibold" className="mb-2">
                        Du søker etter:
                    </BodyShort>
                    <HStack gap="space-8" aria-label="Valgte søkekriterier">
                        {chips.map((label) => (
                            <Tag key={label} variant="moderate" data-color="accent" size="medium">
                                {label}
                            </Tag>
                        ))}
                    </HStack>
                </Box>
            ) : (
                <BodyShort>Du har ikke valgt noen spesifikke kriterier. Vi viser alle ledige stillinger.</BodyShort>
            )}

            <HStack gap="space-8" align="center" wrap>
                <Button
                    as={Link}
                    variant="primary"
                    href={searchUrl}
                    onClick={() => {
                        track("Søkehjelper - klikket se ledige jobber", {
                            jobbtype: state.jobbtype ?? "ikke valgt",
                            sted: state.sted ?? "ikke valgt",
                            yrke: state.yrke ?? "ikke valgt",
                        });
                    }}
                >
                    Se ledige jobber
                </Button>
                <Button variant="tertiary" onClick={onStartPaaNytt}>
                    Start på nytt
                </Button>
            </HStack>
        </VStack>
    );
}

import { BodyShort, Box, Button, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import Link from "next/link";
import { track } from "@/app/_common/umami";
import { buildSearchUrl } from "@/features/sokehjelper/model/buildSearchUrl";
import { JOBBTYPE_OPTIONS, WIZARD_COUNTIES, YRKE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { WizardState } from "@/features/sokehjelper/model/sokehjelperTypes";

type OppsummeringProps = {
    readonly state: WizardState;
    readonly onStartPaaNytt: () => void;
};

function getJobbtypeLabels(state: WizardState): string[] {
    return state.jobbtypes
        .map((jt) => JOBBTYPE_OPTIONS.find((opt) => opt.value === jt)?.label ?? null)
        .filter((label): label is string => label !== null);
}

function getStedLabels(state: WizardState): string[] {
    const labels: string[] = [];

    if (state.steder.includes("hjemmekontor")) {
        labels.push("Hjemmekontor");
    }

    if (state.steder.includes("sted") && state.county !== null) {
        const countyLabel = WIZARD_COUNTIES.find((c) => c.key === state.county)?.label;

        if (countyLabel !== undefined) {
            labels.push(countyLabel);
        }
    }

    return labels;
}

function getYrkeLabels(state: WizardState): string[] {
    const labels: string[] = [];

    for (const yrke of state.yrker) {
        if (yrke === "annet") {
            if (state.fritekst.length > 0) {
                labels.push(state.fritekst);
            }
        } else {
            const label = YRKE_OPTIONS.find((opt) => opt.value === yrke)?.label;

            if (label !== undefined) {
                labels.push(label);
            }
        }
    }

    return labels;
}

export default function Oppsummering({ state, onStartPaaNytt }: OppsummeringProps) {
    const searchUrl = buildSearchUrl(state);

    const chips = [...getJobbtypeLabels(state), ...getStedLabels(state), ...getYrkeLabels(state)];

    return (
        <VStack gap="space-12">
            <Heading size="medium" level="2" id="sokehjelper-overskrift">
                Se over søket ditt
            </Heading>
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
                            jobbtype: state.jobbtypes.join(","),
                            sted: state.steder.join(","),
                            yrke: state.yrker.join(","),
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

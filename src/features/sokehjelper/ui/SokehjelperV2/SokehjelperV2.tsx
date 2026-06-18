"use client";

import { Box, Button, Chips, Heading, HStack, Select, TextField, VStack } from "@navikt/ds-react";
import Link from "next/link";
import { useState } from "react";
import { track } from "@/app/_common/umami";
import { cn } from "@/app/_common/utils/cn";
import { buildSearchUrl } from "@/features/sokehjelper/model/buildSearchUrl";
import { JOBBTYPE_OPTIONS, WIZARD_COUNTIES, YRKE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { ChipsState, JobbType, WizardState, YrkeKategori } from "@/features/sokehjelper/model/sokehjelperTypes";
import SokehjelpFooter from "@/features/sokehjelper/ui/SokehjelpFooter/SokehjelpFooter";
import styles from "./SokehjelperV2.module.css";

const INITIAL_STATE: ChipsState = {
    jobbtypes: [],
    steder: [],
    county: null,
    yrker: [],
    fritekst: "",
};

function toWizardState(state: ChipsState): WizardState {
    return {
        ...state,
        steder: [...(state.county !== null ? (["sted"] as const) : []), ...state.steder],
        aktivtSteg: 1,
    };
}

export default function SokehjelperV2() {
    const [state, setState] = useState<ChipsState>(INITIAL_STATE);

    const harAnnet = state.yrker.includes("annet");
    const searchUrl = buildSearchUrl(toWizardState(state));

    function toggleJobbtype(value: JobbType): void {
        setState((prev) => ({
            ...prev,
            jobbtypes: prev.jobbtypes.includes(value)
                ? prev.jobbtypes.filter((v) => v !== value)
                : [...prev.jobbtypes, value],
        }));
    }

    function toggleHjemmekontor(): void {
        setState((prev) => ({
            ...prev,
            steder: prev.steder.includes("hjemmekontor")
                ? prev.steder.filter((v) => v !== "hjemmekontor")
                : [...prev.steder, "hjemmekontor"],
        }));
    }

    function handleFylke(county: string): void {
        setState((prev) => ({ ...prev, county: county !== "" ? county : null }));
    }

    function toggleYrke(value: YrkeKategori): void {
        setState((prev) => {
            const neste = prev.yrker.includes(value) ? prev.yrker.filter((v) => v !== value) : [...prev.yrker, value];

            return {
                ...prev,
                yrker: neste,
                fritekst: value === "annet" && prev.yrker.includes("annet") ? "" : prev.fritekst,
            };
        });
    }

    function handleSok(): void {
        track("Søkehjelper V2 - klikket se ledige jobber", {
            jobbtype: state.jobbtypes.join(","),
            sted: state.steder.join(","),
            yrke: state.yrker.join(","),
        });
    }

    return (
        <Box
            as="section"
            maxWidth={{ sm: "732px" }}
            marginInline="auto"
            aria-labelledby="sokehjelper-v2-overskrift"
            borderRadius="12"
            borderColor="neutral-subtle"
            borderWidth="1"
            background="neutral-softA"
            className={styles.container}
        >
            <VStack gap="space-8">
                <VStack gap="space-6" className={styles.section}>
                    <Heading size="small" level="2" id="sokehjelper-v2-overskrift">
                        Hvor vil du jobbe?
                    </Heading>
                    <VStack gap="space-4">
                        <Select
                            label="Velg fylke"
                            value={state.county ?? ""}
                            onChange={(e) => handleFylke(e.target.value)}
                            className={cn(styles.select, "mb-5")}
                        >
                            <option value="">Hvor som helst</option>
                            {WIZARD_COUNTIES.map((county) => (
                                <option key={county.key} value={county.key}>
                                    {county.label}
                                </option>
                            ))}
                        </Select>
                        <Chips>
                            <Chips.Toggle
                                data-color="neutral"
                                selected={state.steder.includes("hjemmekontor")}
                                checkmark
                                onClick={toggleHjemmekontor}
                            >
                                🏡 Fra hjemmekontoret
                            </Chips.Toggle>
                        </Chips>
                    </VStack>
                </VStack>

                <hr className={styles.divider} />

                <VStack gap="space-6" className={styles.section}>
                    <Heading size="small" level="3">
                        Hva er du mest interessert i akkurat nå?
                    </Heading>
                    <Chips>
                        {JOBBTYPE_OPTIONS.map((option) => (
                            <Chips.Toggle
                                data-color="neutral"
                                key={option.value}
                                selected={state.jobbtypes.includes(option.value)}
                                checkmark
                                onClick={() => toggleJobbtype(option.value)}
                            >
                                {option.emoji ? `${option.emoji} ${option.label}` : option.label}
                            </Chips.Toggle>
                        ))}
                    </Chips>
                </VStack>

                <hr className={styles.divider} />

                <VStack gap="space-6" className={styles.section}>
                    <Heading size="small" level="3">
                        Hva er du interessert i å jobbe med?
                    </Heading>
                    <VStack gap="space-4">
                        <Chips className="mb-5">
                            {YRKE_OPTIONS.map((option) => (
                                <Chips.Toggle
                                    data-color="neutral"
                                    key={option.value}
                                    selected={state.yrker.includes(option.value)}
                                    checkmark
                                    onClick={() => toggleYrke(option.value)}
                                >
                                    {option.emoji ? `${option.emoji} ${option.label}` : option.label}
                                </Chips.Toggle>
                            ))}
                        </Chips>
                        {harAnnet && (
                            <TextField
                                label="Hva vil du jobbe med?"
                                value={state.fritekst}
                                onChange={(e) => setState((prev) => ({ ...prev, fritekst: e.target.value }))}
                                autoComplete="off"
                            />
                        )}
                    </VStack>
                </VStack>

                <HStack gap="space-4" className={styles.actions}>
                    <Button as={Link} variant="primary" href={searchUrl} onClick={handleSok}>
                        Se ledige jobber
                    </Button>
                    <Button as={Link} variant="tertiary" href="/stillinger">
                        Hopp over
                    </Button>
                </HStack>

                <SokehjelpFooter version="v2" state={toWizardState(state)} />
            </VStack>
        </Box>
    );
}

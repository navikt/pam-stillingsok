"use client";

import {
    BodyShort,
    Box,
    Button,
    Chips,
    UNSAFE_Combobox as Combobox,
    ExpansionCard,
    Heading,
    HStack,
    Label,
    TextField,
    VStack,
} from "@navikt/ds-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
    createOptionByValueMap,
    filterLocationOptions,
    type LocationOption,
} from "@/app/_common/geografi/locationOptions";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { ViewportEventTracker } from "@/app/_common/tracking/ViewportEventTracker";
import { track } from "@/app/_common/umami";
import { buildSearchUrl } from "@/features/sokehjelper/model/buildSearchUrl";
import { getFritekstFeil } from "@/features/sokehjelper/model/fritekst";
import { JOBBTYPE_OPTIONS, YRKE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import { withSokehjelperSource } from "@/features/sokehjelper/model/sokehjelperSource";
import type { ChipsState, JobbType, WizardState, YrkeKategori } from "@/features/sokehjelper/model/sokehjelperTypes";
import {
    buildStedOptions,
    getFylkeOptions,
    HVOR_SOM_HELST_OPTION,
    toStedState,
} from "@/features/sokehjelper/model/stedOptions";
import SokehjelpFooter from "@/features/sokehjelper/ui/SokehjelpFooter/SokehjelpFooter";
import styles from "./Sokehjelper.module.css";

const INITIAL_STATE: ChipsState = {
    jobbtypes: [],
    steder: [],
    county: null,
    municipal: null,
    yrker: [],
    fritekst: "",
};

function toWizardState(state: ChipsState): WizardState {
    return {
        ...state,
        steder: [...(state.county !== null || state.municipal !== null ? (["sted"] as const) : []), ...state.steder],
        aktivtSteg: 1,
    };
}

type SokehjelperProps = {
    readonly locations?: readonly SearchLocation[];
    readonly onSearchClick?: () => void;
};

export default function Sokehjelper({ locations = [], onSearchClick }: SokehjelperProps) {
    const [state, setState] = useState<ChipsState>(INITIAL_STATE);
    const [stedInput, setStedInput] = useState("");
    const stedOptions = useMemo(() => buildStedOptions(locations), [locations]);
    const optionByValue = useMemo(() => createOptionByValueMap(stedOptions), [stedOptions]);
    const comboboxOptions = useMemo(() => [HVOR_SOM_HELST_OPTION, ...stedOptions], [stedOptions]);
    const filteredStedOptions = useMemo(() => {
        if (stedInput.trim() === "") {
            return [HVOR_SOM_HELST_OPTION, ...getFylkeOptions(stedOptions)];
        }
        const matchesHvorSomHelst = HVOR_SOM_HELST_OPTION.label
            .toLocaleLowerCase("nb-NO")
            .includes(stedInput.trim().toLocaleLowerCase("nb-NO"));
        return [
            ...(matchesHvorSomHelst ? [HVOR_SOM_HELST_OPTION] : []),
            ...filterLocationOptions(stedOptions, stedInput),
        ];
    }, [stedOptions, stedInput]);
    const selectedStedKey = state.municipal ?? state.county;
    const selectedSted = (selectedStedKey ? optionByValue.get(selectedStedKey) : undefined) ?? HVOR_SOM_HELST_OPTION;
    const [yrkeOpen, setYrkeOpen] = useState(false);
    const harAnnet = state.yrker.includes("annet");
    const fritekstFeil = harAnnet ? getFritekstFeil(state.fritekst) : undefined;
    // Ugyldig fritekst sendes aldri til søk, telling eller tracking.
    const wizardState = useMemo(
        () => toWizardState(fritekstFeil ? { ...state, fritekst: "" } : state),
        [state, fritekstFeil],
    );
    const searchUrl = buildSearchUrl(wizardState);

    function trackValg(group: "sted" | "ser-etter" | "interesser", valg: string, selected: boolean): void {
        track("Valg - Søkehjelper", { group, valg, selected });
    }

    function toggleJobbtype(value: JobbType): void {
        trackValg("ser-etter", value, !state.jobbtypes.includes(value));
        setState((prev) => ({
            ...prev,
            jobbtypes: prev.jobbtypes.includes(value)
                ? prev.jobbtypes.filter((v) => v !== value)
                : [...prev.jobbtypes, value],
        }));
    }

    function toggleHjemmekontor(): void {
        trackValg("ser-etter", "hjemmekontor", !state.steder.includes("hjemmekontor"));
        setState((prev) => ({
            ...prev,
            steder: prev.steder.includes("hjemmekontor")
                ? prev.steder.filter((v) => v !== "hjemmekontor")
                : [...prev.steder, "hjemmekontor"],
        }));
    }

    function handleSted(option: LocationOption | null): void {
        const previous = state.municipal ?? state.county;
        if (option === null && previous === null) {
            return;
        }
        trackValg("sted", option ? option.value : (previous ?? ""), option !== null);
        setState((prev) => ({ ...prev, ...(option ? toStedState(option) : { county: null, municipal: null }) }));
    }

    function toggleYrke(value: YrkeKategori): void {
        trackValg("interesser", value, !state.yrker.includes(value));
        setState((prev) => {
            const neste = prev.yrker.includes(value) ? prev.yrker.filter((v) => v !== value) : [...prev.yrker, value];

            return {
                ...prev,
                yrker: neste,
                fritekst: value === "annet" && prev.yrker.includes("annet") ? "" : prev.fritekst,
            };
        });
    }

    const sted = state.municipal ?? state.county ?? "";
    const hjemmekontor = state.steder.includes("hjemmekontor");
    const antallValg = state.jobbtypes.length + state.yrker.length + (sted !== "" ? 1 : 0) + (hjemmekontor ? 1 : 0);

    function handleSok(): void {
        track("Søkehjelper - klikket se ledige jobber", {
            jobbtype: state.jobbtypes.join(","),
            sted,
            hjemmekontor,
            yrke: state.yrker.join(","),
            fritekst: wizardState.yrker.includes("annet") && wizardState.fritekst.trim() !== "",
            antallValg,
        });
        onSearchClick?.();
    }

    return (
        <Box
            as="section"
            maxWidth={{ sm: "800px" }}
            marginInline="auto"
            aria-labelledby="sokehjelper-overskrift"
            borderRadius="12"
            borderColor="neutral-subtle"
            borderWidth="1"
            background="neutral-softA"
            className={styles.container}
        >
            <ViewportEventTracker eventName="Søkehjelper - vist" resetKey="sokehjelper" minTimeOnPageMs={0} />
            <VStack gap="space-8">
                <VStack gap="space-6" className={styles.section}>
                    <VStack gap="space-2">
                        <Heading size="small" level="2" id="sokehjelper-overskrift">
                            Finn en jobb som passer deg
                        </Heading>
                        <BodyShort size="small" textColor="subtle">
                            Velg det som er viktig for deg, så hjelper vi deg i gang.
                        </BodyShort>
                    </VStack>
                    <VStack gap="space-4">
                        <Combobox
                            label="Hvor vil du jobbe?"
                            className={styles.select}
                            isMultiSelect={false}
                            shouldAutocomplete
                            options={comboboxOptions}
                            filteredOptions={filteredStedOptions}
                            selectedOptions={[selectedSted]}
                            value={stedInput}
                            onChange={setStedInput}
                            onToggleSelected={(value, isSelected) =>
                                handleSted(isSelected ? (optionByValue.get(value) ?? null) : null)
                            }
                        />
                    </VStack>
                </VStack>
                <hr className={styles.divider} />
                <VStack gap="space-6" className={styles.section}>
                    <Heading size="small" level="3" id="sokehjelper-jobbtype">
                        Hva ser du etter?
                    </Heading>
                    <fieldset className={styles.fieldset} aria-labelledby="sokehjelper-jobbtype">
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
                            <Chips.Toggle
                                data-color="neutral"
                                selected={state.steder.includes("hjemmekontor")}
                                checkmark
                                onClick={toggleHjemmekontor}
                            >
                                🏡 Hjemmekontor
                            </Chips.Toggle>
                        </Chips>
                    </fieldset>
                </VStack>
                <hr className={styles.divider} />
                <div className={styles.section}>
                    <ExpansionCard
                        size="small"
                        data-color="neutral"
                        aria-label="Velg hva du vil jobbe med"
                        open={yrkeOpen}
                        onToggle={setYrkeOpen}
                    >
                        <ExpansionCard.Header>
                            <ExpansionCard.Title as="h3" size="small">
                                {yrkeOpen ? "Skjul interesser" : "Velg hva du vil jobbe med"}
                            </ExpansionCard.Title>
                        </ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <VStack gap="space-4">
                                <Label as="p" id="sokehjelper-yrke">
                                    Hva vil du jobbe med?
                                </Label>
                                <fieldset className={styles.fieldset} aria-labelledby="sokehjelper-yrke">
                                    <Chips>
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
                                </fieldset>
                                {harAnnet && (
                                    <TextField
                                        label="Skriv hva du vil jobbe med"
                                        value={state.fritekst}
                                        onChange={(e) => setState((prev) => ({ ...prev, fritekst: e.target.value }))}
                                        autoComplete="off"
                                        error={fritekstFeil}
                                        description="Teksten brukes som søkeord i søket. Ikke skriv personopplysninger."
                                    />
                                )}
                            </VStack>
                        </ExpansionCard.Content>
                    </ExpansionCard>
                </div>
                <HStack gap="space-4" className={styles.actions}>
                    <Button as={Link} variant="primary" href={withSokehjelperSource(searchUrl)} onClick={handleSok}>
                        {antallValg === 0 ? "Se alle ledige jobber" : "Se jobber som passer"}
                    </Button>
                </HStack>
                <SokehjelpFooter state={wizardState} />
            </VStack>
        </Box>
    );
}

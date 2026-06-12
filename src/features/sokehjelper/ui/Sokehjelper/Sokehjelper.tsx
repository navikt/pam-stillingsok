"use client";

import { Box, Button, HStack, VStack } from "@navikt/ds-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/app/_common/umami";
import type {
    JobbType,
    StedsValg,
    StegHandle,
    WizardState,
    YrkeKategori,
} from "@/features/sokehjelper/model/sokehjelperTypes";
import Oppsummering from "@/features/sokehjelper/ui/Oppsummering/Oppsummering";
import SokehjelpFooter from "@/features/sokehjelper/ui/SokehjelpFooter/SokehjelpFooter";
import StegJobbtype from "@/features/sokehjelper/ui/StegJobbtype/StegJobbtype";
import StegSted from "@/features/sokehjelper/ui/StegSted/StegSted";
import StegYrke from "@/features/sokehjelper/ui/StegYrke/StegYrke";
import styles from "./Sokehjelper.module.css";

const INITIAL_STATE: WizardState = {
    jobbtypes: [],
    steder: [],
    county: null,
    yrker: [],
    fritekst: "",
    aktivtSteg: 1,
};

export default function Sokehjelper() {
    const [state, setState] = useState<WizardState>(INITIAL_STATE);
    const [footerState, setFooterState] = useState<WizardState>(INITIAL_STATE);
    const [stepReady, setStepReady] = useState(false);
    const stepContentRef = useRef<HTMLDivElement>(null);
    const stepRef = useRef<StegHandle | null>(null);

    useEffect(() => {
        setStepReady(false);
    }, [state.aktivtSteg]);

    useEffect(() => {
        if (state.aktivtSteg > 1) {
            stepContentRef.current?.focus();
        }
    }, [state.aktivtSteg]);

    // Sync footer to committed state on every step transition
    useEffect(() => {
        setFooterState(state);
    }, [state]);

    function handleJobbtypes(jobbtypes: JobbType[]): void {
        track("Søkehjelper - valgte jobbtype", { jobbtype: jobbtypes.join(",") });
        setState((prev) => ({ ...prev, jobbtypes, aktivtSteg: 2 }));
    }

    function handleSteder(steder: StedsValg[], county: string | null): void {
        track("Søkehjelper - valgte sted", { sted: steder.join(",") });
        setState((prev) => ({ ...prev, steder, county, aktivtSteg: 3 }));
    }

    function handleYrker(yrker: YrkeKategori[], fritekst: string): void {
        track("Søkehjelper - valgte yrke", { yrke: yrker.join(",") });
        setState((prev) => ({ ...prev, yrker, fritekst, aktivtSteg: 4 }));
    }

    const handleJobbtypePreview = useCallback((jobbtypes: JobbType[]) => {
        setFooterState((prev) => ({ ...prev, jobbtypes }));
    }, []);

    const handleStedPreview = useCallback((steder: StedsValg[], county: string | null) => {
        setFooterState((prev) => ({ ...prev, steder, county }));
    }, []);

    const handleYrkePreview = useCallback((yrker: YrkeKategori[], fritekst: string) => {
        setFooterState((prev) => ({ ...prev, yrker, fritekst }));
    }, []);

    function handleNeste(): void {
        stepRef.current?.submit();
    }

    function handleTilbake(): void {
        setState((prev) => ({
            ...prev,
            aktivtSteg: (prev.aktivtSteg > 1 ? prev.aktivtSteg - 1 : 1) as WizardState["aktivtSteg"],
        }));
    }

    function handleStartPaaNytt(): void {
        setState(INITIAL_STATE);
    }

    return (
        <Box
            as="section"
            maxWidth={{ sm: "732px" }}
            marginInline="auto"
            aria-labelledby="sokehjelper-overskrift"
            borderRadius="12"
            borderColor="neutral-subtle"
            borderWidth="1"
            background="neutral-softA"
            className={styles.container}
        >
            <VStack gap="space-4">
                <Box ref={stepContentRef} tabIndex={-1} paddingBlock="space-8" className={styles.stepContent}>
                    {state.aktivtSteg === 1 && (
                        <StegJobbtype
                            ref={stepRef}
                            onVelg={handleJobbtypes}
                            onReadyChange={setStepReady}
                            onPreview={handleJobbtypePreview}
                            defaultJobbtypes={state.jobbtypes}
                            aktivtSteg={state.aktivtSteg}
                        />
                    )}
                    {state.aktivtSteg === 2 && (
                        <StegSted
                            ref={stepRef}
                            onVelg={handleSteder}
                            onReadyChange={setStepReady}
                            onPreview={handleStedPreview}
                            defaultSteder={state.steder}
                            defaultCounty={state.county}
                            aktivtSteg={state.aktivtSteg}
                        />
                    )}
                    {state.aktivtSteg === 3 && (
                        <StegYrke
                            ref={stepRef}
                            onVelg={handleYrker}
                            onReadyChange={setStepReady}
                            onPreview={handleYrkePreview}
                            defaultYrker={state.yrker}
                            defaultFritekst={state.fritekst}
                            aktivtSteg={state.aktivtSteg}
                        />
                    )}
                    {state.aktivtSteg === 4 && <Oppsummering state={state} onStartPaaNytt={handleStartPaaNytt} />}
                </Box>

                {state.aktivtSteg < 4 ? (
                    <HStack gap="space-4">
                        {state.aktivtSteg > 1 ? (
                            <Button variant="tertiary" onClick={handleTilbake}>
                                Tilbake
                            </Button>
                        ) : null}
                        <Button variant="primary" onClick={handleNeste} disabled={!stepReady}>
                            Neste
                        </Button>
                    </HStack>
                ) : null}

                <SokehjelpFooter state={footerState} />
            </VStack>
        </Box>
    );
}

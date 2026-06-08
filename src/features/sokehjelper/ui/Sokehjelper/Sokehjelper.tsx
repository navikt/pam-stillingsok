"use client";

import { Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { Stepper, StepperStep } from "@navikt/ds-react/Stepper";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/app/_common/umami";
import type { JobbType, StedsValg, WizardState, YrkeKategori } from "@/features/sokehjelper/model/sokehjelperTypes";
import Oppsummering from "@/features/sokehjelper/ui/Oppsummering/Oppsummering";
import StegJobbtype from "@/features/sokehjelper/ui/StegJobbtype/StegJobbtype";
import StegSted from "@/features/sokehjelper/ui/StegSted/StegSted";
import StegYrke from "@/features/sokehjelper/ui/StegYrke/StegYrke";
import styles from "./Sokehjelper.module.css";

const INITIAL_STATE: WizardState = {
    jobbtype: null,
    sted: null,
    county: null,
    yrke: null,
    fritekst: "",
    aktivtSteg: 1,
};

export default function Sokehjelper() {
    const [state, setState] = useState<WizardState>(INITIAL_STATE);
    const stepContentRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (state.aktivtSteg > 1) {
            stepContentRef.current?.focus();
        }
    }, [state.aktivtSteg]);

    function handleJobbtype(jobbtype: JobbType): void {
        track("Søkehjelper - valgte jobbtype", { jobbtype });

        if (jobbtype === "vet-hva-jeg-vil") {
            router.push("/stillinger");
            return;
        }

        setState((prev) => ({ ...prev, jobbtype, aktivtSteg: 2 }));
    }

    function handleSted(sted: StedsValg, county: string | null): void {
        track("Søkehjelper - valgte sted", { sted });
        setState((prev) => ({ ...prev, sted, county, aktivtSteg: 3 }));
    }

    function handleYrke(yrke: YrkeKategori, fritekst: string): void {
        track("Søkehjelper - valgte yrke", { yrke });
        setState((prev) => ({ ...prev, yrke, fritekst, aktivtSteg: 4 }));
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
        <section aria-labelledby="sokehjelper-overskrift" className={styles.container}>
            <VStack gap="space-4">
                <HStack justify="space-between" align="center">
                    <Heading size="medium" level="2" id="sokehjelper-overskrift">
                        Usikker på hva du skal søke etter?
                    </Heading>
                </HStack>

                <Stepper activeStep={state.aktivtSteg} orientation="horizontal" className={styles.stepper}>
                    <StepperStep interactive={false}>Jobbtype</StepperStep>
                    <StepperStep interactive={false}>Sted</StepperStep>
                    <StepperStep interactive={false}>Yrke</StepperStep>
                    <StepperStep interactive={false}>Oppsummering</StepperStep>
                </Stepper>

                <div aria-live="polite" aria-atomic="true" className="navds-sr-only">
                    {`Steg ${state.aktivtSteg} av 4`}
                </div>

                <Box ref={stepContentRef} tabIndex={-1} paddingBlock="space-8" className={styles.stepContent}>
                    {state.aktivtSteg === 1 && <StegJobbtype onVelg={handleJobbtype} />}
                    {state.aktivtSteg === 2 && <StegSted onVelg={handleSted} />}
                    {state.aktivtSteg === 3 && <StegYrke onVelg={handleYrke} />}
                    {state.aktivtSteg === 4 && <Oppsummering state={state} onStartPaaNytt={handleStartPaaNytt} />}
                </Box>

                {state.aktivtSteg > 1 && state.aktivtSteg < 4 ? (
                    <Button variant="tertiary" onClick={handleTilbake} className={styles.tilbakeKnapp}>
                        ← Tilbake
                    </Button>
                ) : null}
            </VStack>
        </section>
    );
}

"use client";

import { Chips, Heading, HGrid, TextField, VStack } from "@navikt/ds-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { YRKE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { StegHandle, YrkeKategori } from "@/features/sokehjelper/model/sokehjelperTypes";

type StegYrkeProps = {
    readonly onVelg: (yrker: YrkeKategori[], fritekst: string) => void;
    readonly onReadyChange: (ready: boolean) => void;
    readonly onPreview?: (yrker: YrkeKategori[], fritekst: string) => void;
    readonly defaultYrker?: YrkeKategori[];
    readonly defaultFritekst?: string;
    readonly aktivtSteg: number;
};

const StegYrke = forwardRef<StegHandle, StegYrkeProps>(function StegYrke(
    { onVelg, onReadyChange, onPreview, defaultYrker, defaultFritekst, aktivtSteg },
    ref,
) {
    const [valgte, setValgte] = useState<YrkeKategori[]>(defaultYrker ?? []);
    const [fritekst, setFritekst] = useState<string>(defaultFritekst ?? "");

    const harAnnet = valgte.includes("annet");
    const kanGaVidere = valgte.length > 0 && (!harAnnet || fritekst.trim().length > 0);

    const handleSubmit = useCallback(() => {
        if (!kanGaVidere) {
            return;
        }

        onVelg(valgte, fritekst.trim());
    }, [kanGaVidere, valgte, fritekst, onVelg]);

    useImperativeHandle(ref, () => ({ submit: handleSubmit }), [handleSubmit]);

    useEffect(() => {
        onReadyChange(kanGaVidere);
    }, [kanGaVidere, onReadyChange]);

    useEffect(() => {
        onPreview?.(valgte, fritekst.trim());
    }, [valgte, fritekst, onPreview]);

    function toggleValg(value: YrkeKategori): void {
        if (value === "annet" && valgte.includes("annet")) {
            setFritekst("");
        }

        setValgte((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    }

    return (
        <VStack gap="space-8">
            <VStack gap="space-4">
                <HGrid gap="space-24" columns="1fr auto" align="center" marginBlock="space-0 space-24">
                    <Heading size="medium" level="2" id="sokehjelper-overskrift">
                        Hva er du interessert i å jobbe med?
                    </Heading>
                    <div aria-live="polite" aria-atomic="true" className="navds-sr-only">
                        {`${aktivtSteg} / 4`}
                    </div>
                </HGrid>

                <Chips aria-labelledby="sokehjelper-overskrift">
                    {YRKE_OPTIONS.map((option) => (
                        <Chips.Toggle
                            data-color="neutral"
                            key={option.value}
                            selected={valgte.includes(option.value)}
                            checkmark
                            aria-label={option.label}
                            onClick={() => toggleValg(option.value)}
                        >
                            {option.emoji ? `${option.emoji} ${option.label}` : option.label}
                        </Chips.Toggle>
                    ))}
                </Chips>
            </VStack>

            {harAnnet ? (
                <TextField
                    label="Hva vil du jobbe med?"
                    value={fritekst}
                    onChange={(e) => setFritekst(e.target.value)}
                    autoComplete="off"
                />
            ) : null}
        </VStack>
    );
});

export default StegYrke;

"use client";

import { Chips, Heading, HGrid, Select, VStack } from "@navikt/ds-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { STED_OPTIONS, WIZARD_COUNTIES } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { StedsValg, StegHandle } from "@/features/sokehjelper/model/sokehjelperTypes";

type StegStedProps = {
    readonly onVelg: (steder: StedsValg[], county: string | null) => void;
    readonly onReadyChange: (ready: boolean) => void;
    readonly onPreview?: (steder: StedsValg[], county: string | null) => void;
    readonly defaultSteder?: StedsValg[];
    readonly defaultCounty?: string | null;
    readonly aktivtSteg: number;
};

const StegSted = forwardRef<StegHandle, StegStedProps>(function StegSted(
    { onVelg, onReadyChange, onPreview, defaultSteder, defaultCounty, aktivtSteg },
    ref,
) {
    const [valgte, setValgte] = useState<StedsValg[]>(defaultSteder ?? []);
    const [valgtFylke, setValgtFylke] = useState<string>(defaultCounty ?? "");

    const harSted = valgte.includes("sted");
    const kanGaVidere = valgte.length > 0 && (!harSted || valgtFylke !== "");

    const handleSubmit = useCallback(() => {
        if (!kanGaVidere) {
            return;
        }

        const county = harSted && valgtFylke !== "" ? valgtFylke : null;
        onVelg(valgte, county);
    }, [kanGaVidere, harSted, valgtFylke, valgte, onVelg]);

    useImperativeHandle(ref, () => ({ submit: handleSubmit }), [handleSubmit]);

    useEffect(() => {
        onReadyChange(kanGaVidere);
    }, [kanGaVidere, onReadyChange]);

    useEffect(() => {
        const county = harSted && valgtFylke !== "" ? valgtFylke : null;
        onPreview?.(valgte, county);
    }, [valgte, valgtFylke, harSted, onPreview]);

    function toggleValg(value: StedsValg): void {
        if (value === "sted" && valgte.includes("sted")) {
            setValgtFylke("");
        }

        setValgte((prev) => {
            if (prev.includes(value)) {
                return prev.filter((v) => v !== value);
            }

            if (value === "hele-landet") {
                return [...prev.filter((v) => v !== "sted"), value];
            }

            if (value === "sted") {
                return [...prev.filter((v) => v !== "hele-landet"), value];
            }

            return [...prev, value];
        });
    }

    return (
        <VStack gap="space-8">
            <VStack gap="space-4">
                <HGrid gap="space-24" columns="1fr auto" align="center" marginBlock="space-0 space-24">
                    <Heading size="medium" level="2" id="sokehjelper-overskrift">
                        Hvor vil du jobbe?
                    </Heading>
                    <div aria-live="polite" aria-atomic="true" className="navds-sr-only">
                        {`${aktivtSteg} / 4`}
                    </div>
                </HGrid>

                <Chips aria-labelledby="sokehjelper-overskrift">
                    {STED_OPTIONS.map((option) => (
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

            {harSted ? (
                <Select label="Velg fylke" value={valgtFylke} onChange={(e) => setValgtFylke(e.target.value)}>
                    <option value="">Velg fylke</option>
                    {WIZARD_COUNTIES.map((county) => (
                        <option key={county.key} value={county.key}>
                            {county.label}
                        </option>
                    ))}
                </Select>
            ) : null}
        </VStack>
    );
});

export default StegSted;

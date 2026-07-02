"use client";

import { Chips, Heading, HGrid, VStack } from "@navikt/ds-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { JOBBTYPE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { JobbType, StegHandle } from "@/features/sokehjelper/model/sokehjelperTypes";

type StegJobbtypeProps = {
    readonly onVelg: (jobbtypes: JobbType[]) => void;
    readonly onReadyChange: (ready: boolean) => void;
    readonly onPreview?: (jobbtypes: JobbType[]) => void;
    readonly defaultJobbtypes?: JobbType[];
    readonly aktivtSteg: number;
};

const StegJobbtype = forwardRef<StegHandle, StegJobbtypeProps>(function StegJobbtype(
    { onVelg, onReadyChange, onPreview, defaultJobbtypes, aktivtSteg },
    ref,
) {
    const [valgte, setValgte] = useState<JobbType[]>(defaultJobbtypes ?? []);

    const handleSubmit = useCallback(() => {
        if (valgte.length > 0) {
            onVelg(valgte);
        }
    }, [valgte, onVelg]);

    useImperativeHandle(ref, () => ({ submit: handleSubmit }), [handleSubmit]);

    useEffect(() => {
        onReadyChange(valgte.length > 0);
    }, [valgte, onReadyChange]);

    useEffect(() => {
        onPreview?.(valgte);
    }, [valgte, onPreview]);

    function toggleValg(value: JobbType): void {
        setValgte((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    }

    return (
        <VStack gap="space-4">
            <HGrid gap="space-24" columns="1fr auto" align="center" marginBlock="space-0 space-24">
                <Heading size="medium" level="2" id="sokehjelper-overskrift">
                    Hva er du mest interessert i akkurat nå?
                </Heading>
                <div aria-live="polite" aria-atomic="true" className="navds-sr-only">
                    {`${aktivtSteg} / 4`}
                </div>
            </HGrid>

            <Chips aria-labelledby="sokehjelper-overskrift">
                {JOBBTYPE_OPTIONS.map((option) => (
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
    );
});

export default StegJobbtype;

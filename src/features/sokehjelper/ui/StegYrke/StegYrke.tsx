"use client";

import { Box, Button, Radio, RadioGroup, Stack, TextField, VStack } from "@navikt/ds-react";
import { useState } from "react";
import { YRKE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { YrkeKategori } from "@/features/sokehjelper/model/sokehjelperTypes";

type StegYrkeProps = {
    readonly onVelg: (yrke: YrkeKategori, fritekst: string) => void;
};

export default function StegYrke({ onVelg }: StegYrkeProps) {
    const [valgtYrke, setValgtYrke] = useState<YrkeKategori | "">("");
    const [fritekst, setFritekst] = useState<string>("");

    const kanGaVidere = valgtYrke !== "" && (valgtYrke !== "annet" || fritekst.trim().length > 0);

    function handleSubmit(): void {
        if (valgtYrke === "") {
            return;
        }

        onVelg(valgtYrke, fritekst.trim());
    }

    return (
        <VStack gap="space-8">
            <RadioGroup
                legend="Hva er du interessert i å jobbe med?"
                value={valgtYrke}
                onChange={(value: YrkeKategori) => {
                    setValgtYrke(value);
                    setFritekst("");
                }}
            >
                <Stack gap="space-0 space-24" direction={{ xs: "column", sm: "row" }} wrap={true}>
                    {YRKE_OPTIONS.map((option) => (
                        <Radio key={option.value} value={option.value}>
                            {option.label}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>

            {valgtYrke === "annet" ? (
                <TextField
                    label="Hva vil du jobbe med?"
                    value={fritekst}
                    onChange={(e) => setFritekst(e.target.value)}
                    autoComplete="off"
                />
            ) : null}

            <Box>
                <Button variant="primary" onClick={handleSubmit} disabled={!kanGaVidere}>
                    Neste
                </Button>
            </Box>
        </VStack>
    );
}

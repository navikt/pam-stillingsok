"use client";

import { Box, Button, Radio, RadioGroup, Select, Stack, VStack } from "@navikt/ds-react";
import { useState } from "react";
import { STED_OPTIONS, WIZARD_COUNTIES } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { StedsValg } from "@/features/sokehjelper/model/sokehjelperTypes";

type StegStedProps = {
    readonly onVelg: (sted: StedsValg, county: string | null) => void;
};

export default function StegSted({ onVelg }: StegStedProps) {
    const [valgtSted, setValgtSted] = useState<StedsValg | "">("");
    const [valgtFylke, setValgtFylke] = useState<string>("");

    const kanGaVidere = valgtSted !== "" && (valgtSted !== "sted" || valgtFylke !== "");

    function handleSubmit(): void {
        if (valgtSted === "") {
            return;
        }

        const county = valgtSted === "sted" && valgtFylke !== "" ? valgtFylke : null;
        onVelg(valgtSted, county);
    }

    return (
        <VStack gap="space-8">
            <RadioGroup
                legend="Hvor vil du jobbe?"
                value={valgtSted}
                onChange={(value: StedsValg) => {
                    setValgtSted(value);
                    setValgtFylke("");
                }}
            >
                <Stack gap="space-0 space-24" direction={{ xs: "column", sm: "row" }} wrap={false}>
                    {STED_OPTIONS.map((option) => (
                        <Radio key={option.value} value={option.value}>
                            {option.label}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>

            {valgtSted === "sted" ? (
                <Select label="Velg fylke" value={valgtFylke} onChange={(e) => setValgtFylke(e.target.value)}>
                    <option value="">Velg fylke</option>
                    {WIZARD_COUNTIES.map((county) => (
                        <option key={county.key} value={county.key}>
                            {county.label}
                        </option>
                    ))}
                </Select>
            ) : null}

            <Box>
                <Button variant="primary" onClick={handleSubmit} disabled={!kanGaVidere}>
                    Neste
                </Button>
            </Box>
        </VStack>
    );
}

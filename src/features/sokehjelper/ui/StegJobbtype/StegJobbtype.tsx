"use client";

import { Box, Button, Radio, RadioGroup, Stack, VStack } from "@navikt/ds-react";
import { useState } from "react";
import { JOBBTYPE_OPTIONS } from "@/features/sokehjelper/model/sokehjelperConstants";
import type { JobbType } from "@/features/sokehjelper/model/sokehjelperTypes";

type StegJobbtypeProps = {
    readonly onVelg: (jobbtype: JobbType) => void;
};

export default function StegJobbtype({ onVelg }: StegJobbtypeProps) {
    const [valgt, setValgt] = useState<JobbType | "">("");

    function handleSubmit(): void {
        if (valgt !== "") {
            onVelg(valgt);
        }
    }

    return (
        <VStack gap="space-8">
            <RadioGroup
                legend="Hva slags jobb leter du etter?"
                value={valgt}
                onChange={(value: JobbType) => setValgt(value)}
            >
                <Stack gap="space-0 space-24" direction={{ xs: "column", sm: "row" }} wrap={true}>
                    {JOBBTYPE_OPTIONS.map((option) => (
                        <Radio key={option.value} value={option.value}>
                            {option.label}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>

            <Box>
                <Button variant="primary" onClick={handleSubmit} disabled={valgt === ""}>
                    Neste
                </Button>
            </Box>
        </VStack>
    );
}

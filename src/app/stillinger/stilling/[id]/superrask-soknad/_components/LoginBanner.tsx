"use client";

import { Box, Button, HStack, Label, List, Show, VStack } from "@navikt/ds-react";
import FigureDoorScene from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/FigureDoorScene";

interface LoginBannerProps {
    onLogin: () => void;
}

export default function LoginBanner({ onLogin }: LoginBannerProps) {
    return (
        <Box borderRadius="2" padding={{ xs: "space-16", md: "space-32" }} className="bg-brand-peach-subtle mb-10">
            <HStack align="center" justify="space-between" wrap={false}>
                <VStack>
                    <Label as="span">Få mer ut av søknaden</Label>
                    <List className="mt-2">
                        <List.Item>Få full oversikt over søknadene du har sendt.</List.Item>
                        <List.Item>Vis arbeidsgivere at du er en ekte person.</List.Item>
                    </List>
                    <div className="mt-4">
                        <Button variant="secondary" size="small" className="display-inline" onClick={onLogin}>
                            Logg inn
                        </Button>
                    </div>
                </VStack>
                <Show above="md">
                    <FigureDoorScene />
                </Show>
            </HStack>
        </Box>
    );
}

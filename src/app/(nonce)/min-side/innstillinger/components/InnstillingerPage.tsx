"use client";

import { Box, Heading, VStack, Alert, BodyLong } from "@navikt/ds-react";
import { useCallback, useContext, useEffect, useState } from "react";
import LagredeSokOgFavoritter from "@/app/(nonce)/min-side/innstillinger/components/LagredeSokOgFavoritter";
import Epost from "@/app/(nonce)/min-side/innstillinger/components/Epost";
import { PersonaliaContext } from "@/app/(nonce)/min-side/_common/components/context/PersonaliaContext";
import LoadingPage from "@/app/(nonce)/min-side/_common/components/LoadingPage";
import { PageBlock } from "@navikt/ds-react/Page";

type SamtykkeStatus = "not-fetched" | "pending" | "success" | "error";

type ApiUserResponse = {
    email?: string | null;
    verifiedEmail: boolean;
    uuid: string;
};

type Personalia = {
    data?: { navn?: string | null } | null;
};

export default function InnstillingerPage() {
    const [harSamtykket, setHarSamtykket] = useState<boolean | null>(null);
    const [epost, setEpost] = useState<string | null>(null);
    const [uuid, setUuid] = useState<string | null>(null);
    const [harVerifisertEpost, setVerifisertEpost] = useState<boolean | null>(null);
    const [lagretEpost, setLagretEpost] = useState<string | null>(null);
    const [requestFeilet, setRequestFeilet] = useState<boolean>(false);
    const [samtykkeStatus, setSamtykkeStatus] = useState<SamtykkeStatus>("not-fetched");
    const [slettEpostPanel, setSlettEpostPanel] = useState<boolean>(false);

    const personalia = useContext<Personalia>(PersonaliaContext);

    const fetchSamtykke = useCallback(async (): Promise<void> => {
        setSamtykkeStatus("pending");
        setRequestFeilet(false);

        try {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });

            if (response.status === 200) {
                const json: ApiUserResponse = await response.json();
                setHarSamtykket(true);
                const email = json.email ?? "";
                setEpost(email);
                setLagretEpost(email);
                setVerifisertEpost(json.verifiedEmail);
                setUuid(json.uuid);
                setSamtykkeStatus("success");
            } else if (response.status === 404) {
                setHarSamtykket(false);
                setSamtykkeStatus("success");
            } else {
                setRequestFeilet(true);
                setSamtykkeStatus("error");
            }
        } catch {
            setRequestFeilet(true);
            setSamtykkeStatus("error");
        }
    }, []);

    useEffect(() => {
        void fetchSamtykke();
    }, [fetchSamtykke]);

    const navn: string = personalia?.data?.navn ?? "";

    if (samtykkeStatus === "not-fetched" || samtykkeStatus === "pending") {
        return (
            <div className="text-center">
                <LoadingPage />
            </div>
        );
    }

    return (
        <PageBlock as="section" width="md" gutters>
            <Box paddingBlock={{ xs: "8 8", md: "16 16" }}>
                {requestFeilet && (
                    <Alert variant="error" className="mb-4">
                        <Heading level="5" size="xsmall" align="start" className="mb-2">
                            Kunne ikke hente samtykke
                        </Heading>
                        <BodyLong className="mb-3">Vennligst prøv igjen senere.</BodyLong>
                    </Alert>
                )}
                <Heading level="1" size="xlarge" align="center" className="mb-12">
                    Samtykker og innstillinger
                </Heading>
                <VStack align="start" className="mb-8">
                    <LagredeSokOgFavoritter
                        harSamtykket={harSamtykket}
                        setHarSamtykket={setHarSamtykket}
                        epost={epost}
                        setEpost={setEpost}
                        navn={navn}
                        setUuid={setUuid}
                        setVerifisertEpost={setVerifisertEpost}
                        setLagretEpost={setLagretEpost}
                        setSlettEpostPanel={setSlettEpostPanel}
                    />

                    <Epost
                        harSamtykket={harSamtykket}
                        setHarSamtykket={setHarSamtykket}
                        epost={epost}
                        setEpost={setEpost}
                        navn={navn}
                        uuid={uuid}
                        lagretEpost={lagretEpost}
                        setLagretEpost={setLagretEpost}
                        harVerifisertEpost={harVerifisertEpost}
                        setVerifisertEpost={setVerifisertEpost}
                        slettEpostPanel={slettEpostPanel}
                        setSlettEpostPanel={setSlettEpostPanel}
                        fetchSamtykke={fetchSamtykke}
                    />
                </VStack>
            </Box>
        </PageBlock>
    );
}

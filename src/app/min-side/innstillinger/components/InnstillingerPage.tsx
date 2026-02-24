"use client";

import { Box, Heading, VStack, BodyLong, LocalAlert } from "@navikt/ds-react";
import { useCallback, useContext, useEffect, useState } from "react";
import LagredeSokOgFavoritter from "@/app/min-side/innstillinger/components/LagredeSokOgFavoritter";
import Epost from "@/app/min-side/innstillinger/components/Epost";
import { PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import { PageBlock } from "@navikt/ds-react/Page";
import { getUser } from "@/app/min-side/_common/client/aduserUserClient";

type SamtykkeStatus = "not-fetched" | "pending" | "success" | "error";

export default function InnstillingerPage() {
    const [harSamtykket, setHarSamtykket] = useState<boolean | null>(null);
    const [epost, setEpost] = useState<string | null>(null);
    const [uuid, setUuid] = useState<string | null>(null);
    const [harVerifisertEpost, setVerifisertEpost] = useState<boolean | null>(null);
    const [lagretEpost, setLagretEpost] = useState<string | null>(null);
    const [requestFeilet, setRequestFeilet] = useState<boolean>(false);
    const [samtykkeStatus, setSamtykkeStatus] = useState<SamtykkeStatus>("not-fetched");
    const [slettEpostPanel, setSlettEpostPanel] = useState<boolean>(false);

    const personalia = useContext(PersonaliaContext);

    const fetchSamtykke = useCallback(async (): Promise<void> => {
        setSamtykkeStatus("pending");
        setRequestFeilet(false);

        try {
            const result = await getUser();

            if (result.ok) {
                setHarSamtykket(true);
                const email = result.data.email ?? "";
                setEpost(email);
                setLagretEpost(email);
                setVerifisertEpost(result.data.verifiedEmail);
                setUuid(result.data.uuid);
                setSamtykkeStatus("success");
            } else if (result.status === 404) {
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

    const navn = personalia.status === "success" ? personalia?.data?.navn : "";

    if (samtykkeStatus === "not-fetched" || samtykkeStatus === "pending") {
        return (
            <div className="text-center">
                <LoadingPage />
            </div>
        );
    }

    return (
        <PageBlock as="section" width="md" gutters>
            <Box paddingBlock={{ xs: "space-32", md: "space-64" }}>
                {requestFeilet && (
                    <LocalAlert status="error" className="mb-4">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Kunne ikke hente samtykke</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            <BodyLong>Vennligst prøv igjen senere.</BodyLong>
                        </LocalAlert.Content>
                    </LocalAlert>
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

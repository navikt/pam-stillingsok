"use client";

import { CogIcon, SealCheckmarkIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Heading, HStack, LocalAlert } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { useCallback, useContext, useEffect, useState } from "react";
import { PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import Epost from "@/app/min-side/innstillinger/components/Epost";
import LagredeSokOgFavoritter from "@/app/min-side/innstillinger/components/LagredeSokOgFavoritter";

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
            const response = await fetch("/api/aduser/v1/user", {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });

            if (response.ok) {
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
        <>
            <PageBlock as="section" width="md" gutters>
                {requestFeilet && (
                    <LocalAlert status="error" className="mt-5 mb-5">
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
            </PageBlock>

            <Box background="accent-soft">
                <PageBlock width="md" gutters>
                    <Box paddingBlock="space-32" className="mb-12">
                        <Heading level="2" size="small" spacing>
                            <HStack align="center" gap="space-4">
                                <SealCheckmarkIcon fontSize="1.5rem" aria-hidden="true" />
                                Dine samtykker
                            </HStack>
                        </Heading>
                        <Box padding="space-16" borderRadius="8" background="default">
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
                        </Box>

                        <Heading level="2" size="small" spacing>
                            <HStack align="center" gap="space-4">
                                <CogIcon fontSize="1.5rem" aria-hidden="true" />
                                Innstillinger
                            </HStack>
                        </Heading>
                        <Box padding="space-16" borderRadius="8" background="default">
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
                        </Box>
                    </Box>
                </PageBlock>
            </Box>
        </>
    );
}

import {
    Alert,
    BodyLong,
    Box,
    Button,
    ConfirmationPanel,
    ExpansionCard,
    Heading,
    HStack,
    List,
    Modal,
    Tag,
    VStack,
} from "@navikt/ds-react";
import { FileTextIcon, CheckmarkCircleIcon, TrashIcon } from "@navikt/aksel-icons";

import { Dispatch, SetStateAction, useId, useState } from "react";
import { z } from "zod";
import Samtykketekst from "@/app/(nonce)/min-side/innstillinger/components/Samtykketekst";
import { ListItem } from "@navikt/ds-react/List";

type Nullable<T> = T | null;

type Props = {
    harSamtykket: boolean | null;
    epost: Nullable<string>;
    setEpost: Dispatch<SetStateAction<Nullable<string>>>;
    navn?: Nullable<string>;
    setHarSamtykket: Dispatch<SetStateAction<boolean | null>>;
    setUuid: Dispatch<SetStateAction<Nullable<string>>>;
    setVerifisertEpost: Dispatch<SetStateAction<Nullable<boolean>>>;
    setLagretEpost: Dispatch<SetStateAction<Nullable<string>>>;
    setSlettEpostPanel: Dispatch<SetStateAction<boolean>>;
};

const PostResponseSchema = z.object({
    uuid: z.string().min(1),
});
type PostResponse = z.infer<typeof PostResponseSchema>;

export default function LagredeSokOgFavoritter({
    harSamtykket,
    epost,
    setEpost,
    navn,
    setHarSamtykket,
    setUuid,
    setVerifisertEpost,
    setLagretEpost,
    setSlettEpostPanel,
}: Props) {
    const [samtykkeModal, setSamtykkeModal] = useState<boolean>(false);
    const [visSamtykketekst, setVisSamtykketekst] = useState<boolean>(false);
    const [samtykkeError, setSamtykkeError] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [bekreftSamtykke, setBekreftSamtykke] = useState<boolean>(false);
    const [slettSamtykkePanel, setSlettSamtykkePanel] = useState<boolean>(false);
    const [requestFeilet, setRequestFeilet] = useState<boolean>(false);

    const samtykkeLabelId = useId();

    const onCloseSamtykkeModal = (): void => {
        setSamtykkeModal(false);
        setSamtykkeError(false);
        setBekreftSamtykke(false);
        setRequestFeilet(false);
    };

    const onSamtykke = async (email: Nullable<string>, name: Nullable<string>): Promise<void> => {
        if (!bekreftSamtykke) {
            setSamtykkeError(true);
            return;
        }

        try {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                credentials: "same-origin",
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    email: email ?? "",
                    name: name ?? "",
                    acceptedTerms: "true",
                }),
            });

            if (response.status === 200) {
                const raw = (await response.json()) as unknown;
                const parsed = PostResponseSchema.safeParse(raw);
                if (!parsed.success) {
                    setRequestFeilet(true);
                    return;
                }

                const json: PostResponse = parsed.data;
                setHarSamtykket(true);
                setUuid(json.uuid);
                setSamtykkeModal(false);
                setSamtykkeError(false);
                setRequestFeilet(false);
            } else {
                setRequestFeilet(true);
            }
        } catch {
            setRequestFeilet(true);
        }
    };

    const onSlettSamtykke = async (): Promise<void> => {
        try {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                method: "DELETE",
            });

            if (response.status === 200) {
                setHarSamtykket(false);
                setUuid(null);
                setVerifisertEpost(null);
                setEpost(null);
                setLagretEpost(null);
                setSlettSamtykkePanel(false);
                setBekreftSamtykke(false);
                setSlettEpostPanel(false);
            } else {
                setRequestFeilet(true);
            }
        } catch {
            setRequestFeilet(true);
        }
    };

    const onExpandedChange = (newExpanded: boolean): void => {
        setExpanded(newExpanded);
    };

    const onSamtykkeCheckboxClick = (): void => {
        setSamtykkeError(false);
        setBekreftSamtykke((x) => !x);
    };

    return (
        <>
            <Heading level="2" size="large" align="start" className="mb-4">
                Lagrede søk og favoritter
            </Heading>

            <BodyLong id={samtykkeLabelId}>Samtykke gjelder behandling av:</BodyLong>
            <List className="mb-4" aria-labelledby={samtykkeLabelId}>
                <ListItem>annonser du har merket som favoritter</ListItem>
                <ListItem>søk du har lagret</ListItem>
                <ListItem>e-postadresse som brukes for varsel om nye treff i lagrede søk</ListItem>
            </List>

            <HStack gap="4" align="center" className="mb-4">
                {harSamtykket ? (
                    <Tag variant="success-moderate">Du har samtykket</Tag>
                ) : (
                    <Tag variant="warning-moderate">Du har ikke samtykket</Tag>
                )}

                {harSamtykket ? (
                    <Button
                        disabled={slettSamtykkePanel}
                        size="small"
                        variant="tertiary"
                        onClick={() => setSlettSamtykkePanel(true)}
                        id="slett-samtykke"
                        icon={<TrashIcon aria-hidden="true" fontSize="1.25rem" />}
                    >
                        Slett samtykke
                    </Button>
                ) : (
                    <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => setSamtykkeModal(true)}
                        id="gi-samtykke"
                        icon={<CheckmarkCircleIcon aria-hidden="true" fontSize="1.25rem" />}
                    >
                        Gi samtykke
                    </Button>
                )}

                <Button
                    size="small"
                    variant="tertiary"
                    onClick={() => setVisSamtykketekst(true)}
                    id="vis-samtykke"
                    icon={<FileTextIcon aria-hidden="true" fontSize="1.25rem" />}
                >
                    Vis samtykketekst
                </Button>

                {/* Samtykketekst-modal */}
                <Modal
                    open={visSamtykketekst}
                    aria-label="Samtykke for lagrede søk og favoritter"
                    onClose={() => setVisSamtykketekst(false)}
                    width="medium"
                    closeOnBackdropClick
                >
                    <Modal.Header closeButton>
                        <Heading level="2" size="large">
                            Samtykketekst for lagrede søk og favoritter
                        </Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <Samtykketekst />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setVisSamtykketekst(false)} id="lukk-samtykketekst">
                            Lukk
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Gi samtykke-modal */}
                <Modal
                    open={samtykkeModal}
                    aria-label="Ta i bruk lagrede søk og favoritter"
                    onClose={onCloseSamtykkeModal}
                    width="medium"
                >
                    <Modal.Header closeButton>
                        <Heading level="2" size="large">
                            Ta i bruk lagrede søk og favoritter
                        </Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <BodyLong className="mb-6">
                            For å kunne ta i bruk lagrede søk og favoritter trenger vi først ditt samtykke. Du kan når
                            som helst trekke tilbake ditt samtykke i dine innstillinger.
                        </BodyLong>

                        <ExpansionCard
                            size="small"
                            aria-label="Small-variant"
                            className="mb-4"
                            onToggle={onExpandedChange}
                            open={expanded}
                        >
                            <ExpansionCard.Header>
                                <ExpansionCard.Title as="h4" size="small">
                                    Vis samtykketekst for lagrede søk og favoritter
                                </ExpansionCard.Title>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <Samtykketekst />
                            </ExpansionCard.Content>
                        </ExpansionCard>

                        <ConfirmationPanel
                            checked={bekreftSamtykke}
                            label="Jeg har lest og forstått samtykketeksten, og ønsker ta i bruk lagrede søk og favoritter."
                            onChange={onSamtykkeCheckboxClick}
                            error={
                                samtykkeError
                                    ? "Du må samtykke før du kan ta i bruk lagrede søk og favoritter"
                                    : undefined
                            }
                        />

                        {requestFeilet && (
                            <Alert variant="error" className="mt-4">
                                <Heading level="5" size="xsmall" align="start" className="mb-2">
                                    Noe gikk galt
                                </Heading>
                                <BodyLong className="mb-3">Kunne ikke lagre samtykke. Prøv igjen senere.</BodyLong>
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={() => onSamtykke(epost, navn ?? null)}
                            id="lagrede-søk-og-favoritter"
                        >
                            Ta i bruk lagrede søk og favoritter
                        </Button>
                        <Button variant="tertiary" onClick={onCloseSamtykkeModal} id="avbryt-lagrede-søk-og-favoritter">
                            Avbryt
                        </Button>
                    </Modal.Footer>
                </Modal>
            </HStack>

            {harSamtykket && slettSamtykkePanel && (
                <Box padding="6" background="surface-alt-2-subtle" borderRadius="medium" className="mb-4">
                    <Heading level="5" size="xsmall" align="start" className="mb-2">
                        Bekreft at du ønsker å slette samtykket for lagrede søk og favoritter
                    </Heading>
                    <BodyLong className="mb-3">
                        Alle dine lagrede søk og favoritter vil slettes, i tillegg til e-postadressen for varsel dersom
                        du har oppgitt det. Informasjonen vil ikke kunne gjenopprettes.
                    </BodyLong>
                    <VStack align="end">
                        <HStack gap="2">
                            <Button
                                size="small"
                                variant="secondary"
                                id="avbryt-slett-samtykke"
                                onClick={() => setSlettSamtykkePanel(false)}
                            >
                                Avbryt
                            </Button>
                            <Button size="small" variant="primary" id="slett-samtykke" onClick={onSlettSamtykke}>
                                Ja, slett samtykke
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            )}

            {requestFeilet && harSamtykket && (
                <Alert variant="error" className="mb-4">
                    <Heading level="5" size="xsmall" align="start" className="mb-2">
                        Kunne ikke slette samtykke
                    </Heading>
                    <BodyLong className="mb-3">Vennligst prøv igjen senere.</BodyLong>
                </Alert>
            )}
        </>
    );
}

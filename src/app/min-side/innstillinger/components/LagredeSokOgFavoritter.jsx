import {
    Alert,
    BodyLong,
    Box,
    Button,
    ConfirmationPanel,
    ExpansionCard,
    Heading,
    HStack,
    Modal,
    Tag,
    VStack,
} from "@navikt/ds-react";
import { FileTextIcon, CheckmarkCircleIcon, TrashIcon } from "@navikt/aksel-icons";
import Samtykketekst from "@/app/min-side/innstillinger/components/Samtykketekst";
import { useId, useState } from "react";

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
}) {
    const [samtykkeModal, setSamtykkeModal] = useState(false);
    const [visSamtykketekst, setVisSamtykketekst] = useState(false);
    const [samtykkeError, setSamtykkeError] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [bekreftSamtykke, setBekreftSamtykke] = useState(false);
    const [slettSamtykkePanel, setSlettSamtykkePanel] = useState(false);
    const [requestFeilet, setRequestFeilet] = useState(false);
    const samtykkeLabelId = useId();

    const onCloseSamtykkeModal = () => {
        setSamtykkeModal(false);
        setSamtykkeError(false);
        setBekreftSamtykke(false);
        setRequestFeilet(false);
    };

    async function onSamtykke(epost, navn) {
        if (bekreftSamtykke) {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                credentials: "same-origin",
                method: "POST",
                body: JSON.stringify({
                    email: epost,
                    name: navn,
                    acceptedTerms: "true",
                }),
            });
            if (response.status === 200) {
                const json = await response.json();
                setHarSamtykket(true);
                setUuid(json.uuid);
                setSamtykkeModal(false);
                setSamtykkeError(false);
                setRequestFeilet(false);
            } else {
                setRequestFeilet(true);
            }
        } else {
            setSamtykkeError(true);
        }
    }

    async function onSlettSamtykke() {
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
    }

    const onExpandedChange = (newExpanded) => {
        setExpanded(newExpanded);
    };

    function onSamtykkeCheckboxClick() {
        setSamtykkeError(false);
        setBekreftSamtykke((x) => !x);
    }

    return (
        <>
            <Heading level="2" size="large" align="left" className="mb-4">
                Lagrede søk og favoritter
            </Heading>
            <BodyLong id={samtykkeLabelId}>Samtykke gjelder behandling av:</BodyLong>
            <ul className="mb-4" aria-labelledby={samtykkeLabelId}>
                <li>
                    <BodyLong className="mb-2">annonser du har merket som favoritter</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">søk du har lagret</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">e-postadresse som brukes for varsel om nye treff i lagrede søk</BodyLong>
                </li>
            </ul>
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
                <Modal
                    open={visSamtykketekst}
                    aria-label="Samtykke for lagrede søk og favoritter"
                    onClose={() => setVisSamtykketekst(false)}
                    width="medium"
                    closeOnBackdropClick
                >
                    <Modal.Header closeButton={true}>
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
                <Modal
                    open={samtykkeModal}
                    aria-label="Ta i bruk lagrede søk og favoritter"
                    onClose={onCloseSamtykkeModal}
                    width="medium"
                >
                    <Modal.Header closeButton={true}>
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
                            onChange={() => onSamtykkeCheckboxClick()}
                            error={samtykkeError && "Du må samtykke før du kan ta i bruk lagrede søk og favoritter"}
                        ></ConfirmationPanel>
                        {requestFeilet && (
                            <Alert variant="error" className="mt-4">
                                <Heading level="5" size="xsmall" align="left" className="mb-2">
                                    Noe gikk galt
                                </Heading>
                                <BodyLong className="mb-3">Kunne ikke lagre samtykke. Prøv igjen senere.</BodyLong>
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={() => onSamtykke(epost, navn)}
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
                    <Heading level="5" size="xsmall" align="left" className="mb-2">
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
                            <Button
                                size="small"
                                variant="primary"
                                id="slett-samtykke"
                                onClick={() => onSlettSamtykke()}
                            >
                                Ja, slett samtykke
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            )}
            {requestFeilet && harSamtykket && (
                <Alert variant="error" className="mb-4">
                    <Heading level="5" size="xsmall" align="left" className="mb-2">
                        Kunne ikke slette samtykke
                    </Heading>
                    <BodyLong className="mb-3">Vennligst prøv igjen senere.</BodyLong>
                </Alert>
            )}
        </>
    );
}

"use client";

import { Alert, BodyLong, Box, Button, Heading, HStack, Link, Modal, TextField, VStack } from "@navikt/ds-react";
import { PlusCircleIcon, PencilIcon, TrashIcon, FloppydiskIcon, EnvelopeClosedIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import ValidateEmail from "@/app/min-side/_common/components/ValidateEmail";
import { FigureWithEnvelope } from "@navikt/arbeidsplassen-react";

export default function Epost({
    harSamtykket,
    setHarSamtykket,
    epost,
    setEpost,
    navn,
    uuid,
    lagretEpost,
    setLagretEpost,
    harVerifisertEpost,
    setVerifisertEpost,
    slettEpostPanel,
    setSlettEpostPanel,
    fetchSamtykke,
}) {
    const [isLagreEpostPanel, setIsLagreEpostPanel] = useState(false);
    const [isEpostError, setIsEpostError] = useState(false);
    const [verifiseringspostSendt, setVerifiseringspostSendt] = useState(false);
    const [showVerifiseringspostAlert, setShowVerifiseringspostAlert] = useState(false);
    const [requestFeilet, setRequestFeilet] = useState(false);
    const [isEpostBekreftModalOpen, setIsEpostBekreftModalOpen] = useState(false);
    const [showVerifiseringspostAlertModal, setShowVerifiseringspostAlertModal] = useState(false);

    async function lagreEpost() {
        if (!epost || !ValidateEmail(epost)) {
            setIsEpostError(true);
        } else {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                method: "PUT",
                body: JSON.stringify({
                    email: epost,
                    name: navn,
                    acceptedTerms: "true",
                    uuid: uuid,
                }),
            });
            if (response.status === 200) {
                setIsLagreEpostPanel(false);
                setHarSamtykket(true);
                setLagretEpost(epost);
                setVerifiseringspostSendt(false);
                setRequestFeilet(false);
                if (lagretEpost !== epost) {
                    setVerifisertEpost(false);
                    setIsEpostBekreftModalOpen(true);
                }
            } else {
                setRequestFeilet(true);
            }
            setIsEpostError(false);
        }
    }

    function avbrytLagre() {
        setIsLagreEpostPanel(false);
        setEpost(lagretEpost);
        setIsEpostError(false);
        setRequestFeilet(false);
    }

    async function slettEpost(epost, navn, uuid) {
        const response = await fetch("/min-side/api/aduser/api/v1/user", {
            method: "PUT",
            body: JSON.stringify({
                email: epost,
                name: navn,
                acceptedTerms: "true",
                uuid: uuid,
            }),
        });
        if (response.status === 200) {
            setHarSamtykket(true);
            setIsEpostError(false);
            setEpost(null);
            setLagretEpost(null);
            setSlettEpostPanel(false);
            setIsLagreEpostPanel(false);
            setVerifiseringspostSendt(false);
            setRequestFeilet(false);
        } else {
            setRequestFeilet(true);
        }
    }

    async function sendNyBekreftelse() {
        const response = await fetch("/min-side/api/aduser/api/v1/resendverificationemail", {
            method: "PUT",
        });
        if (response.status === 200) {
            setVerifiseringspostSendt(true);
            if (isEpostBekreftModalOpen) {
                setShowVerifiseringspostAlertModal(true);
            } else {
                setShowVerifiseringspostAlert(true);
            }
            setRequestFeilet(false);
        } else {
            setRequestFeilet(true);
        }
    }

    function onEpostBekreftCloseClick() {
        if (isEpostBekreftModalOpen) {
            fetchSamtykke();
        }
        setIsEpostBekreftModalOpen(false);
    }

    return (
        <>
            {harSamtykket && (
                <>
                    <div className="mb-4"></div>
                    <Heading level="3" size="medium" align="left" className="mb-4">
                        E-postadresse for varsel om nye treff i lagrede søk
                    </Heading>
                    <BodyLong className="mb-4">
                        E-postadressen blir kun brukt til varsel om nye treff for dine lagrede søk.
                    </BodyLong>
                    <BodyLong className="mb-6">
                        Dersom du ikke lenger ønsker å motta varsler for et søk så kan du enten fjerne varslingen eller
                        fjerne søket i{" "}
                        <Link href={`/stillinger/lagrede-sok`} inlineText>
                            dine lagrede søk.
                        </Link>
                    </BodyLong>
                    {!epost && !isLagreEpostPanel && (
                        <HStack>
                            <Button
                                size="small"
                                variant="tertiary"
                                id="legg-til-epost"
                                onClick={() => setIsLagreEpostPanel(true)}
                                icon={<PlusCircleIcon aria-hidden="true" fontSize="1.25rem" />}
                            >
                                Legg til e-postadresse
                            </Button>
                        </HStack>
                    )}
                    {(isLagreEpostPanel || epost) && (
                        <TextField
                            readOnly={!isLagreEpostPanel}
                            className="mb-4"
                            id="epost-adresse"
                            label="E-postadresse for varsel"
                            type="email"
                            value={epost || ""}
                            onChange={(e) => setEpost(e.target.value)}
                            error={isEpostError && "E-postadressen er ugyldig, kontroller at du ikke savner noen tegn"}
                        />
                    )}
                    <HStack gap="2" align="start" className="mb-4">
                        {isLagreEpostPanel && (
                            <>
                                <Button
                                    size="small"
                                    variant="primary"
                                    id="lagre-epost"
                                    onClick={() => lagreEpost()}
                                    icon={<FloppydiskIcon aria-hidden="true" fontSize="1.25rem" />}
                                >
                                    Lagre e-postadresse
                                </Button>
                                <Button
                                    size="small"
                                    variant="secondary"
                                    id="avbryt-lagre-epost"
                                    onClick={() => avbrytLagre()}
                                >
                                    Avbryt
                                </Button>
                            </>
                        )}
                        {epost && lagretEpost && !isLagreEpostPanel && (
                            <Button
                                size="small"
                                variant="tertiary"
                                id="endre-epost"
                                onClick={() => setIsLagreEpostPanel(true)}
                                icon={<PencilIcon aria-hidden="true" fontSize="1.25rem" />}
                            >
                                Endre e-postadresse
                            </Button>
                        )}
                        {epost && lagretEpost && (
                            <Button
                                disabled={slettEpostPanel}
                                size="small"
                                variant="tertiary"
                                id="slett-epost"
                                onClick={() => setSlettEpostPanel(true)}
                                icon={<TrashIcon aria-hidden="true" fontSize="1.25rem" />}
                            >
                                Slett e-postadresse
                            </Button>
                        )}
                    </HStack>
                    {slettEpostPanel && (
                        <Box padding="6" background="surface-alt-2-subtle" borderRadius="medium" className="mb-4">
                            <Heading level="5" size="xsmall" align="left" className="mb-2">
                                Bekreft at du ønsker å slette e-postadressen din
                            </Heading>
                            <BodyLong className="mb-3">
                                Du vil ikke lenger kunne motta varsler om nye treff i dine lagrede søk.
                            </BodyLong>
                            <VStack align="end">
                                <HStack gap="2">
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        id="avbryt-slett-epost"
                                        onClick={() => setSlettEpostPanel(false)}
                                    >
                                        Avbryt
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="primary"
                                        id="ja-slett-epost"
                                        onClick={() => slettEpost(null, navn, uuid)}
                                    >
                                        Ja, slett e-postadresse
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>
                    )}
                    <Modal
                        open={isEpostBekreftModalOpen}
                        aria-label="Sjekk e-posten din for å bekrefte adressen"
                        onClose={() => onEpostBekreftCloseClick()}
                        width="medium"
                        closeOnBackdropClick
                    >
                        <Modal.Header closeButton={true}>
                            <Heading level="2" size="large">
                                Sjekk e-posten din for å bekrefte adressen
                            </Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <BodyLong className="mb-6">
                                Du vil ikke kunne motta noen varsler før du bekrefter e-postadressen din. Dersom du ikke
                                har fått en e-post innen et par minutter så kan du prøve å sende en ny.
                            </BodyLong>
                            <HStack justify="center" className={showVerifiseringspostAlertModal ? "mb-6" : ""}>
                                <FigureWithEnvelope />
                            </HStack>
                            {verifiseringspostSendt && showVerifiseringspostAlertModal && (
                                <>
                                    <Alert
                                        role="status"
                                        variant="info"
                                        closeButton
                                        onClose={() => setShowVerifiseringspostAlertModal(false)}
                                    >
                                        En ny verifiseringsmail er sendt til {lagretEpost}
                                    </Alert>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" id="lukk-modal" onClick={() => onEpostBekreftCloseClick()}>
                                Lukk
                            </Button>
                            <Button
                                variant="tertiary"
                                id="send-ny-bekreftelse-epost-modal"
                                onClick={() => sendNyBekreftelse()}
                                icon={<EnvelopeClosedIcon aria-hidden="true" fontSize="1.5rem" />}
                            >
                                Send ny bekreftelse på e-post
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {lagretEpost && !harVerifisertEpost && (
                        <>
                            <Alert variant="warning" className="mb-4">
                                <Heading level="5" size="xsmall" align="left" className="mb-2">
                                    E-postadressen din er ikke bekreftet
                                </Heading>
                                <BodyLong>
                                    Du vil ikke kunne motta noen varsler før du bekrefter e-postadressen din. Dersom du
                                    ikke finner bekreftelsen kan du sende en ny.
                                </BodyLong>
                            </Alert>
                            {verifiseringspostSendt && showVerifiseringspostAlert && (
                                <>
                                    <Alert
                                        role="status"
                                        variant="info"
                                        className="mb-4"
                                        closeButton
                                        onClose={() => setShowVerifiseringspostAlert(false)}
                                    >
                                        En ny verifiseringsmail er sendt til {lagretEpost}
                                    </Alert>
                                </>
                            )}
                            <HStack align="start" className="mb-4">
                                <Button
                                    size="small"
                                    variant="tertiary"
                                    id="send-ny-bekreftelse-epost"
                                    onClick={() => sendNyBekreftelse()}
                                    icon={<EnvelopeClosedIcon aria-hidden="true" fontSize="1.25rem" />}
                                >
                                    Send ny bekreftelse på e-post
                                </Button>
                            </HStack>
                        </>
                    )}
                </>
            )}
            {requestFeilet && (
                <Alert variant="error" className="mb-4 mt-2">
                    <Heading level="5" size="xsmall" align="left" className="mb-2">
                        Kunne ikke lagre epost / sende ut ny bekreftelse
                    </Heading>
                    <BodyLong className="mb-3">Vennligst prøv igjen senere.</BodyLong>
                </Alert>
            )}
        </>
    );
}

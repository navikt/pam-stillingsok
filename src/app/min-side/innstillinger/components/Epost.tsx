import { BodyLong, Box, Button, Heading, HStack, LocalAlert, Modal, TextField, VStack } from "@navikt/ds-react";
import { PlusCircleIcon, PencilIcon, TrashIcon, FloppydiskIcon, EnvelopeClosedIcon } from "@navikt/aksel-icons";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import ValidateEmail from "@/app/min-side/_common/components/ValidateEmail";
import { FigureWithEnvelope } from "@navikt/arbeidsplassen-react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Nullable<T> = T | null;

type Props = {
    harSamtykket: boolean | null;
    setHarSamtykket: Dispatch<SetStateAction<boolean | null>>;

    epost: Nullable<string>;
    setEpost: Dispatch<SetStateAction<Nullable<string>>>;

    navn?: Nullable<string>;
    uuid: Nullable<string>;

    lagretEpost: Nullable<string>;
    setLagretEpost: Dispatch<SetStateAction<Nullable<string>>>;

    harVerifisertEpost: Nullable<boolean>;
    setVerifisertEpost: Dispatch<SetStateAction<Nullable<boolean>>>;

    slettEpostPanel: boolean;
    setSlettEpostPanel: Dispatch<SetStateAction<boolean>>;

    fetchSamtykke: () => Promise<void>;
};

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
}: Props) {
    const [isLagreEpostPanel, setIsLagreEpostPanel] = useState<boolean>(false);
    const [isEpostError, setIsEpostError] = useState<boolean>(false);
    const [verifiseringspostSendt, setVerifiseringspostSendt] = useState<boolean>(false);
    const [showVerifiseringspostAlert, setShowVerifiseringspostAlert] = useState<boolean>(false);
    const [requestFeilet, setRequestFeilet] = useState<boolean>(false);
    const [isEpostBekreftModalOpen, setIsEpostBekreftModalOpen] = useState<boolean>(false);
    const [showVerifiseringspostAlertModal, setShowVerifiseringspostAlertModal] = useState<boolean>(false);

    async function lagreEpost(): Promise<void> {
        if (!epost || !ValidateEmail(epost)) {
            setIsEpostError(true);
            return;
        }

        try {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    email: epost,
                    name: navn ?? "",
                    acceptedTerms: "true",
                    uuid,
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
        } catch {
            setRequestFeilet(true);
        }
    }

    function avbrytLagre() {
        setIsLagreEpostPanel(false);
        setEpost(lagretEpost);
        setIsEpostError(false);
        setRequestFeilet(false);
    }

    async function slettEpost(email: Nullable<string>, name: Nullable<string>, id: Nullable<string>) {
        try {
            const response = await fetch("/min-side/api/aduser/api/v1/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    email,
                    name,
                    acceptedTerms: "true",
                    uuid: id,
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
        } catch {
            setRequestFeilet(true);
        }
    }

    async function sendNyBekreftelse() {
        try {
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
        } catch {
            setRequestFeilet(true);
        }
    }

    function onEpostBekreftCloseClick() {
        if (isEpostBekreftModalOpen) {
            void fetchSamtykke();
        }
        setIsEpostBekreftModalOpen(false);
    }

    return (
        <>
            {harSamtykket && (
                <>
                    <div className="mb-4" />
                    <Heading level="3" size="medium" align="start" className="mb-4">
                        E-postadresse for varsel om nye treff i lagrede søk
                    </Heading>
                    <BodyLong className="mb-4">
                        E-postadressen blir kun brukt til varsel om nye treff for dine lagrede søk.
                    </BodyLong>
                    <BodyLong className="mb-6">
                        Dersom du ikke lenger ønsker å motta varsler for et søk så kan du enten fjerne varslingen eller
                        fjerne søket i{" "}
                        <AkselNextLink href="/stillinger/lagrede-sok" inlineText>
                            dine lagrede søk.
                        </AkselNextLink>
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

                    {(isLagreEpostPanel || Boolean(epost)) && (
                        <TextField
                            readOnly={!isLagreEpostPanel}
                            className="mb-4"
                            id="epost-adresse"
                            label="E-postadresse for varsel"
                            autoComplete="email"
                            type="email"
                            value={epost ?? ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEpost(e.target.value)}
                            error={isEpostError && "E-postadressen er ugyldig, kontroller at du ikke savner noen tegn"}
                        />
                    )}

                    <HStack gap="space-8" align="start" className="mb-4">
                        {isLagreEpostPanel && (
                            <>
                                <Button
                                    size="small"
                                    variant="primary"
                                    id="lagre-epost"
                                    onClick={() => void lagreEpost()}
                                    icon={<FloppydiskIcon aria-hidden="true" fontSize="1.25rem" />}
                                >
                                    Lagre e-postadresse
                                </Button>
                                <Button size="small" variant="secondary" id="avbryt-lagre-epost" onClick={avbrytLagre}>
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
                        <Box padding="space-24" background="meta-lime-soft" borderRadius="4" className="mb-4">
                            <Heading level="5" size="xsmall" align="start" className="mb-2">
                                Bekreft at du ønsker å slette e-postadressen din
                            </Heading>
                            <BodyLong className="mb-3">
                                Du vil ikke lenger kunne motta varsler om nye treff i dine lagrede søk.
                            </BodyLong>
                            <VStack align="end">
                                <HStack gap="space-8">
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
                                        onClick={() => void slettEpost(null, navn ?? null, uuid)}
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
                        onClose={onEpostBekreftCloseClick}
                        width="medium"
                        closeOnBackdropClick
                    >
                        <Modal.Header closeButton>
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
                                <LocalAlert role="status" status="announcement">
                                    <LocalAlert.Header className="padding-0-75">
                                        <LocalAlert.Title>
                                            <BodyLong>En ny verifiseringsmail er sendt til {lagretEpost}</BodyLong>
                                        </LocalAlert.Title>
                                        <LocalAlert.CloseButton
                                            onClick={() => setShowVerifiseringspostAlertModal(false)}
                                        />
                                    </LocalAlert.Header>
                                </LocalAlert>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" id="lukk-modal" onClick={onEpostBekreftCloseClick}>
                                Lukk
                            </Button>
                            <Button
                                variant="tertiary"
                                id="send-ny-bekreftelse-epost-modal"
                                onClick={() => void sendNyBekreftelse()}
                                icon={<EnvelopeClosedIcon aria-hidden="true" fontSize="1.5rem" />}
                            >
                                Send ny bekreftelse på e-post
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {lagretEpost && !harVerifisertEpost && (
                        <>
                            <LocalAlert status="warning" className="mb-4">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>E-postadressen din er ikke bekreftet</LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>
                                    <BodyLong>
                                        Du vil ikke kunne motta noen varsler før du bekrefter e-postadressen din. Dersom
                                        du ikke finner bekreftelsen kan du sende en ny.
                                    </BodyLong>
                                </LocalAlert.Content>
                            </LocalAlert>

                            {verifiseringspostSendt && showVerifiseringspostAlert && (
                                <LocalAlert role="status" status="announcement" className="mb-4">
                                    <LocalAlert.Header className="padding-0-75">
                                        <LocalAlert.Title>
                                            <BodyLong>En ny verifiseringsmail er sendt til {lagretEpost}</BodyLong>
                                        </LocalAlert.Title>
                                        <LocalAlert.CloseButton onClick={() => setShowVerifiseringspostAlert(false)} />
                                    </LocalAlert.Header>
                                </LocalAlert>
                            )}

                            <HStack align="start" className="mb-4">
                                <Button
                                    size="small"
                                    variant="tertiary"
                                    id="send-ny-bekreftelse-epost"
                                    onClick={() => void sendNyBekreftelse()}
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
                <LocalAlert status="error" className="mb-4 mt-2">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Kunne ikke lagre epost / sende ut ny bekreftelse</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        <BodyLong>Vennligst prøv igjen senere.</BodyLong>
                    </LocalAlert.Content>
                </LocalAlert>
            )}
        </>
    );
}

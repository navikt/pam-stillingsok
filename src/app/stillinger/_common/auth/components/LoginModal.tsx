import { CheckmarkIcon, EnterIcon } from "@navikt/aksel-icons";
import { FigureWithKey } from "@navikt/arbeidsplassen-react";
import { BodyLong, Button, HGrid, HStack, List, Modal, Show } from "@navikt/ds-react";

type LoginModalProps = {
    onLoginClick: () => void;
    onCloseClick: () => void;
};
function LoginModal({ onLoginClick, onCloseClick }: LoginModalProps) {
    return (
        <Modal
            width="medium"
            role="alertdialog"
            open
            header={{ heading: "Logg inn og få bedre oversikt" }}
            onClose={onCloseClick}
        >
            <Modal.Body>
                <HGrid columns={{ md: 2 }} gap="space-16">
                    <div>
                        <List className="mb-10">
                            <List.Item icon={<CheckmarkIcon aria-hidden />}>Lagre jobber du vil se på senere</List.Item>
                            <List.Item icon={<CheckmarkIcon aria-hidden />}>
                                Finn igjen søkene dine når du vil
                            </List.Item>
                            <List.Item icon={<CheckmarkIcon aria-hidden />}>Se søknadene du har sendt</List.Item>
                            <List.Item icon={<CheckmarkIcon aria-hidden />}>
                                Det koster ingenting. Null stress.
                            </List.Item>
                        </List>
                        <BodyLong>
                            <em>Du bruker ID-porten, så du slipper enda et brukernavn og passord.</em>
                        </BodyLong>
                    </div>

                    <Show above="md" asChild>
                        <HStack justify="center" align="center">
                            <FigureWithKey />
                        </HStack>
                    </Show>
                </HGrid>
            </Modal.Body>
            <Modal.Footer>
                {onLoginClick ? (
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={onLoginClick}>
                        Logg inn
                    </Button>
                ) : (
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={onLoginClick}>
                        Logg inn
                    </Button>
                )}

                {onCloseClick && (
                    <Button variant="secondary" onClick={onCloseClick}>
                        Avbryt
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default LoginModal;

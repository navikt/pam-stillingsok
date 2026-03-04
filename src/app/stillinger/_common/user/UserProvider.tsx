import React, { useContext, useEffect, useMemo, useState } from "react";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import { AdUser, fetchAdUser } from "@/app/_common/auth/aduserClient";

export const UserContext: React.Context<UserContextProps> = React.createContext({} as UserContextProps);

export const HasAcceptedTermsStatus = {
    NOT_FETCHED: "NO_FETCHED",
    NOT_ACCEPTED: "NOT_ACCEPTED",
    HAS_ACCEPTED: "HAS_ACCEPTED",
};

export interface UserContextProps {
    user?: AdUser;
    updateUser: (data: AdUser) => void;
    hasAcceptedTermsStatus?: string;
}

interface UserProviderProps {
    children: React.ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [userResponse, setUserResponse] = useState<AdUser>();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [hasAcceptedTermsStatus, setHasAcceptedTermsStatus] = useState(HasAcceptedTermsStatus.NOT_FETCHED);
    const [forbiddenUser, setForbiddenUser] = useState(false);

    function updateUser(data: AdUser | undefined): void {
        setUserResponse(data);
        setHasAcceptedTermsStatus(HasAcceptedTermsStatus.HAS_ACCEPTED);
    }

    function removeUser(): void {
        setUserResponse(undefined);
        setHasAcceptedTermsStatus(HasAcceptedTermsStatus.NOT_FETCHED);
    }

    function logout(): void {
        // Redirect to front page if when logging out from /min-side
        if (window.location.pathname === "/min-side") {
            window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/")}`;
        } else {
            window.location.href = `/oauth2/logout?redirect=${encodeURIComponent(window.location.href)}`;
        }
    }

    const fetchUserInternal = useMemo(() => {
        const assertNever = (value: never): never => {
            throw new Error(`Unhandled reason: ${String(value)}`);
        };

        return async (): Promise<void> => {
            try {
                const result = await fetchAdUser();

                if (result.ok) {
                    setForbiddenUser(false);
                    setHasAcceptedTermsStatus(HasAcceptedTermsStatus.HAS_ACCEPTED);

                    updateUser(result.data);
                    return;
                }

                removeUser();
                setForbiddenUser(false);

                switch (result.reason) {
                    case "not-found": {
                        setHasAcceptedTermsStatus(HasAcceptedTermsStatus.NOT_ACCEPTED);
                        return;
                    }
                    case "forbidden": {
                        setForbiddenUser(true);
                        return;
                    }
                    case "unauthorized": {
                        openErrorDialog();
                        return;
                    }
                    case "http-error": {
                        openErrorDialog();
                        return;
                    }
                    case "invalid-json": {
                        openErrorDialog();
                        return;
                    }
                    case "network-error": {
                        openErrorDialog();
                        return;
                    }
                    default: {
                        assertNever(result.reason);
                    }
                }
            } catch {
                openErrorDialog();
            }
        };
    }, [openErrorDialog]);

    // TODO: useMemo?
    const userContextValues: UserContextProps = {
        user: userResponse,
        updateUser,
        hasAcceptedTermsStatus,
    };

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            void fetchUserInternal();
        }

        if (authenticationStatus !== AuthenticationStatus.IS_AUTHENTICATED) {
            removeUser();
        }
    }, [authenticationStatus]);

    return (
        <UserContext.Provider value={userContextValues}>
            {children}

            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
                forbiddenUser &&
                !shouldShowErrorDialog && (
                    <Modal
                        width="medium"
                        onClose={logout}
                        header={{
                            heading: "Du kan dessverre ikke ta i bruk de innloggede tjenestene",
                            closeButton: false,
                        }}
                        open
                    >
                        <>
                            <Modal.Body>
                                <BodyLong className="mb-8">
                                    Personnummeret ditt kan ikke brukes for innloggede tjenester og vi må logge deg ut.
                                    Vi beklager dette. Du kan fortsatt søke etter stillinger selv om du ikke er
                                    innlogget.
                                </BodyLong>
                                <HStack justify="center">
                                    <WorriedFigure />
                                </HStack>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={logout}>
                                    Logg ut
                                </Button>
                            </Modal.Footer>
                        </>
                    </Modal>
                )}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="user-provider-error" onClose={closeErrorDialog} title="Feil">
                    Klarte ikke hente innlogget bruker. Forsøk å laste siden på nytt.
                </AlertModalWithPageReload>
            )}
        </UserContext.Provider>
    );
}

export default UserProvider;

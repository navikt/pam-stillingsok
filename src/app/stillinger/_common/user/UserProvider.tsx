import React, { ReactElement, useContext, useEffect, useState } from "react";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import * as actions from "@/app/stillinger/_common/actions";

export const UserContext: React.Context<UserContextProps> = React.createContext({} as UserContextProps);

export const HasAcceptedTermsStatus = {
    NOT_FETCHED: "NO_FETCHED",
    NOT_ACCEPTED: "NOT_ACCEPTED",
    HAS_ACCEPTED: "HAS_ACCEPTED",
};

export interface UserContextProps {
    user?: User;
    updateUser: (data: User) => void;
    hasAcceptedTermsStatus?: string;
}

export interface User {
    id: string;
    uuid: string;
    email?: string;
    name?: string;
    verifiedEmail?: boolean;
    acceptedTerms?: string;
}

interface UserProviderProps {
    children: React.ReactNode;
}

function UserProvider({ children }: UserProviderProps): ReactElement {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [userResponse, setUserResponse] = useState<User>();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [hasAcceptedTermsStatus, setHasAcceptedTermsStatus] = useState(HasAcceptedTermsStatus.NOT_FETCHED);
    const [forbiddenUser, setForbiddenUser] = useState(false);

    function updateUser(data: User | undefined): void {
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

    async function fetchUser(): Promise<User | undefined> {
        let result;

        try {
            result = await actions.getUser();
        } catch (err) {
            openErrorDialog();
            return;
        }

        if (result.success) {
            updateUser(result.data);
        } else if (result.statusCode === 403) {
            setForbiddenUser(true);
        } else if (result.statusCode === 404) {
            setHasAcceptedTermsStatus(HasAcceptedTermsStatus.NOT_ACCEPTED);
        } else {
            openErrorDialog();
        }
    }

    // TODO: useMemo?
    // eslint-disable-next-line
    const userContextValues: UserContextProps = {
        user: userResponse,
        updateUser,
        hasAcceptedTermsStatus,
    };

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            fetchUser().then();
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

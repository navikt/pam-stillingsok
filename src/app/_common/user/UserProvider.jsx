import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import { AuthenticationContext, AuthenticationStatus } from "@/app/_common/auth/contexts/AuthenticationProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import { setAuthenticatedStatus } from "@/app/_common/monitoring/amplitude";
import * as actions from "@/app/_common/actions";

export const UserContext = React.createContext({});

export const HasAcceptedTermsStatus = {
    NOT_FETCHED: "NO_FETCHED",
    NOT_ACCEPTED: "NOT_ACCEPTED",
    HAS_ACCEPTED: "HAS_ACCEPTED",
};

function UserProvider({ children }) {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [userResponse, setUserResponse] = useState();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [hasAcceptedTermsStatus, setHasAcceptedTermsStatus] = useState(HasAcceptedTermsStatus.NOT_FETCHED);
    const [forbiddenUser, setForbiddenUser] = useState(false);

    function updateUser(data) {
        setUserResponse(data);
        setHasAcceptedTermsStatus(HasAcceptedTermsStatus.HAS_ACCEPTED);
    }

    function logout() {
        window.location.href = `/stillinger/oauth2/logout?redirect=${encodeURIComponent(window.location.href)}`;
    }

    async function fetchUser() {
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
    const userContextValues = {
        user: userResponse,
        updateUser,
        hasAcceptedTermsStatus,
    };

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            fetchUser();
        }
    }, [authenticationStatus]);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            setAuthenticatedStatus(true);
        } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            setAuthenticatedStatus(false);
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
                                    Vi beklager dette. Du kan fortsatt søke etter stillinger og delta på jobbtreff selv
                                    om du ikke er innlogget.
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

UserProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default UserProvider;

import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { AuthenticationContext, AuthenticationStatus } from "../auth/contexts/AuthenticationProvider";
import UserAPI from "../api/UserAPI";
import { FetchAction, useFetchReducer } from "../hooks/useFetchReducer";
import useToggle from "../hooks/useToggle";
import AlertModalWithPageReload from "../components/modals/AlertModalWithPageReload";
import { setAuthenticatedStatus } from "../tracking/amplitude";

export const UserContext = React.createContext({});

export const HasAcceptedTermsStatus = {
    NOT_FETCHED: "NO_FETCHED",
    NOT_ACCEPTED: "NOT_ACCEPTED",
    HAS_ACCEPTED: "HAS_ACCEPTED",
};

function UserProvider({ children }) {
    const { authenticationStatus, userNameAndInfo, logout } = useContext(AuthenticationContext);
    const [userResponse, dispatch] = useFetchReducer();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [hasAcceptedTermsStatus, setHasAcceptedTermsStatus] = useState(HasAcceptedTermsStatus.NOT_FETCHED);

    function fetchUser() {
        dispatch({ type: FetchAction.BEGIN });

        console.log(`username: ${userNameAndInfo}`);

        UserAPI.get("api/v1/user")
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
                if (error.statusCode !== 404) {
                    openErrorDialog();
                }
            });
    }

    function updateUser(data) {
        dispatch({ type: FetchAction.SET_DATA, data });
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
        if (userResponse.data) {
            setHasAcceptedTermsStatus(HasAcceptedTermsStatus.HAS_ACCEPTED);
        } else if (userResponse.error && userResponse.error.statusCode === 404) {
            setHasAcceptedTermsStatus(HasAcceptedTermsStatus.NOT_ACCEPTED);
        }
    }, [userResponse]);

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

            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && userNameAndInfo === false && (
                <Modal width="medium" onClose={logout} header={{ heading: "Ikke tilgang" }} open>
                    <>
                        <Modal.Body>
                            <BodyLong>
                                Du har dessverre ikke tilgang til denne tjenesten. Har du tidligere hatt aktive søk er
                                disse nå fjernet.
                            </BodyLong>
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

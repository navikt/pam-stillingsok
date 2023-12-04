import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
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
    const { authenticationStatus, logout } = useContext(AuthenticationContext);
    const [userResponse, dispatch] = useFetchReducer();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [hasAcceptedTermsStatus, setHasAcceptedTermsStatus] = useState(HasAcceptedTermsStatus.NOT_FETCHED);
    const [forbiddenUser, setForbiddenUser] = useState(false);

    function fetchUser() {
        dispatch({ type: FetchAction.BEGIN });

        UserAPI.get("api/v1/user")
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
                if (error.statusCode === 403) {
                    setForbiddenUser(true);
                } else if (error.statusCode !== 404) {
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

            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && forbiddenUser && (
                <Modal
                    width="medium"
                    onClose={logout}
                    header={{ heading: "Du kan dessverre ikke ta i bruk de innloggede tjenestene" }}
                    open
                >
                    <>
                        <Modal.Body>
                            <BodyLong>
                                Personnummeret ditt kan ikke brukes for innloggede tjenester og vi må logge deg ut. Vi
                                beklager dette. Du kan fortsatt søke etter stillinger og delta på jobbtreff selv om du
                                ikke er innlogget.
                            </BodyLong>
                            <WorriedFigure className="mb-8" />
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

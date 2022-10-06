import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { captureException } from "@sentry/browser";
import { AuthenticationContext, AuthenticationStatus } from "../Authentication/AuthenticationProvider";
import UserAPI from "../../api/UserAPI";
import { FetchAction, useFetchReducer } from "../../hooks/useFetchReducer";
import useToggle from "../../hooks/useToggle";
import AlertModalWithPageReload from "../../components/AlertModal/AlertModalWithPageReload";

export const UserContext = React.createContext({});

export const HasAcceptedTermsStatus = {
    NOT_FETCHED: "NO_FETCHED",
    NOT_ACCEPTED: "NOT_ACCEPTED",
    HAS_ACCEPTED: "HAS_ACCEPTED"
};

const UserProvider = ({ children }) => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [userResponse, dispatch] = useFetchReducer();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [hasAcceptedTermsStatus, setHasAcceptedTermsStatus] = useState(HasAcceptedTermsStatus.NOT_FETCHED);

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

    function fetchUser() {
        dispatch({ type: FetchAction.BEGIN });
        UserAPI.get("api/v1/user")
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
                if (error.statusCode !== 404) {
                    captureException(error);
                    openErrorDialog();
                }
            });
    }

    function updateUser(data) {
        dispatch({ type: FetchAction.SET_DATA, data });
    }

    const userContextValues = {
        user: userResponse,
        updateUser,
        hasAcceptedTermsStatus
    };

    return (
        <UserContext.Provider value={userContextValues}>
            {children}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="user-provider-error" onClose={closeErrorDialog} title="Feil">
                    Klarte ikke hente innlogget bruker. Forsøk å laste siden på nytt.
                </AlertModalWithPageReload>
            )}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default UserProvider;

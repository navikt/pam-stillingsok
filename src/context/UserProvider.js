import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {captureException} from "@sentry/browser";
import { AuthenticationContext, AuthenticationStatus } from "./AuthenticationProvider";
import { adUserApiGet } from "../api/aduser/adUserApi";
import {FetchAction, useFetchReducer} from "../hooks/useFetchReducer";
import { NotificationsContext } from "./NotificationsProvider";

export const UserContext = React.createContext({});

export const HasAcceptedTermsStatus = {
    NOT_FETCHED: "NO_FETCHED",
    NOT_ACCEPTED: "NOT_ACCEPTED",
    HAS_ACCEPTED: "HAS_ACCEPTED"
};

const UserProvider = ({ children }) => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const { notifyError } = useContext(NotificationsContext);
    const [userResponse, dispatch] = useFetchReducer();

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
        adUserApiGet("api/v1/user")
            .then(data => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch(error => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
                if (error.statusCode !== 404) {
                    notifyError("Klarte ikke laste inn bruker. Forsøk å laste siden på nytt");
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

    return <UserContext.Provider value={userContextValues}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default UserProvider;

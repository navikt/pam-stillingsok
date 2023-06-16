import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import SearchAPI from "../../../common/api/SearchAPI";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import InterestAPI from "../api/InterestAPI";
import TrekkSoknadSuccess from "./TrekkSoknadSuccess";
import TrekkSoknadConfirmationRequired from "./TrekkSoknadConfirmationRequired";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import NotFound404 from "../../../common/components/NotFound/NotFound404";

function TrekkSoknad({ match }) {
    const [{ data: ad, status: adFetchStatus }, dispatch] = useFetchReducer();
    const [removeApplicationResponse, removeApplicationDispatch] = useFetchReducer();
    const [applicationStatus, applicationStatusDispatch] = useFetchReducer();
    const [show404Page, setShow404Page] = useState(false);
    const [useDefault404Text, setUseDefault404Text] = useState(false);

    /**
     * Fetch ad
     */
    useEffect(() => {
        const id = match.params.adUuid;

        dispatch({ type: FetchAction.BEGIN });
        applicationStatusDispatch({ type: FetchAction.BEGIN });

        SearchAPI.get(`api/stilling/${id}`)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
                setUseDefault404Text(true);
            });

        InterestAPI.getApplicationStatus(match.params.adUuid, match.params.uuid)
            .then((data) => {
                applicationStatusDispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                applicationStatusDispatch({ type: FetchAction.REJECT, error });
                if (error.statusCode === 404) {
                    setUseDefault404Text(true);
                }
            });
    }, []);

    useEffect(() => {
        if (adFetchStatus === FetchStatus.FAILURE && removeApplicationResponse.status === FetchStatus.NOT_FETCHED) {
            setShow404Page(true);
        } else if (
            applicationStatus.status === FetchStatus.FAILURE &&
            removeApplicationResponse.status === FetchStatus.NOT_FETCHED
        ) {
            setShow404Page(true);
        } else {
            setShow404Page(false);
        }
    }, [adFetchStatus, removeApplicationResponse, applicationStatus]);

    const handleWithDrawClick = async () => {
        removeApplicationDispatch({ type: FetchAction.BEGIN });
        let success = false;
        await InterestAPI.withdrawApplication(match.params.adUuid, match.params.uuid)
            .then((data) => {
                removeApplicationDispatch({ type: FetchAction.RESOLVE, data });
                success = true;
            })
            .catch((error) => {
                removeApplicationDispatch({ type: FetchAction.REJECT, error });
            });
        try {
            logAmplitudeEvent("delete superrask søknad", {
                stillingsId: match.params.adUuid,
                candidateId: match.params.uuid,
                success,
            });
        } catch (e) {
            // ignore
        }
    };

    return (
        <div className="WithdrawApplication">
            {!show404Page &&
                (adFetchStatus === FetchStatus.IS_FETCHING || applicationStatus === FetchStatus.IS_FETCHING) && (
                    <DelayedSpinner />
                )}

            {show404Page && !useDefault404Text && (
                <NotFound404
                    title="Vi fant dessverre ikke din søknad"
                    text="Det kan være at du allerede har trukket søknaden din eller at bedriften har avslått søknaden din."
                />
            )}

            {show404Page && useDefault404Text && <NotFound404 />}

            {!show404Page &&
                (adFetchStatus === FetchStatus.SUCCESS ||
                    (adFetchStatus === FetchStatus.FAILURE &&
                        removeApplicationResponse.status !== FetchStatus.NOT_FETCHED)) &&
                (removeApplicationResponse.status !== FetchStatus.SUCCESS ? (
                    <TrekkSoknadConfirmationRequired
                        handleWithDrawClick={handleWithDrawClick}
                        isDeleting={removeApplicationResponse.status === FetchStatus.IS_FETCHING}
                        hasError={removeApplicationResponse.status === FetchStatus.FAILURE}
                        ad={adFetchStatus === FetchStatus.SUCCESS ? ad : undefined}
                    />
                ) : (
                    <TrekkSoknadSuccess />
                ))}
        </div>
    );
}

TrekkSoknad.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            adUuid: PropTypes.string,
            uuid: PropTypes.string,
        }),
    }),
};

export default TrekkSoknad;

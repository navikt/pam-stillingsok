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
    const [deleteSoknadResponse, deleteSoknadDispatch] = useFetchReducer();
    const [candidateInterestForm, candidateInterestFormDispatch] = useFetchReducer();
    const [show404Page, setShow404Page] = useState(false);
    const [useDefault404Text, setUseDefault404Text] = useState(false);

    /**
     * Fetch ad
     */
    useEffect(() => {
        const id = match.params.adUuid;

        dispatch({ type: FetchAction.BEGIN });
        candidateInterestFormDispatch({ type: FetchAction.BEGIN });

        SearchAPI.get(`api/stilling/${id}`)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
                setUseDefault404Text(true);
            });

        InterestAPI.getCandidateInterestForm(match.params.adUuid, match.params.uuid)
            .then((data) => {
                candidateInterestFormDispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                candidateInterestFormDispatch({ type: FetchAction.REJECT, error });
                if (error.statusCode === 404) {
                    setUseDefault404Text(true);
                }
            });
    }, []);

    useEffect(() => {
        if (adFetchStatus === FetchStatus.FAILURE && deleteSoknadResponse.status === FetchStatus.NOT_FETCHED) {
            setShow404Page(true);
        } else if (
            candidateInterestForm.status === FetchStatus.FAILURE &&
            deleteSoknadResponse.status === FetchStatus.NOT_FETCHED
        ) {
            setShow404Page(true);
        } else {
            setShow404Page(false);
        }
    }, [adFetchStatus, deleteSoknadResponse, candidateInterestForm]);

    const handleWithDrawClick = async () => {
        deleteSoknadDispatch({ type: FetchAction.BEGIN });
        let success = false;
        await InterestAPI.deleteInterest(match.params.adUuid, match.params.uuid)
            .then((data) => {
                deleteSoknadDispatch({ type: FetchAction.RESOLVE, data });
                success = true;
            })
            .catch((error) => {
                deleteSoknadDispatch({ type: FetchAction.REJECT, error });
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
        <div className="InterestMessageDelete">
            {!show404Page &&
                (adFetchStatus === FetchStatus.IS_FETCHING || candidateInterestForm === FetchStatus.IS_FETCHING) && (
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
                        deleteSoknadResponse.status !== FetchStatus.NOT_FETCHED)) &&
                (deleteSoknadResponse.status !== FetchStatus.SUCCESS ? (
                    <TrekkSoknadConfirmationRequired
                        handleWithDrawClick={handleWithDrawClick}
                        isDeleting={deleteSoknadResponse.status === FetchStatus.IS_FETCHING}
                        hasError={deleteSoknadResponse.status === FetchStatus.FAILURE}
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

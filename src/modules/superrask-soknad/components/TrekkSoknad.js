import React, { useEffect } from "react";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import SearchAPI from "../../../common/api/SearchAPI";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import InterestAPI from "../api/InterestAPI";
import TrekkSoknadSuccess from "./TrekkSoknadSuccess";
import TrekkSoknadConfirmationRequired from "./TrekkSoknadConfirmationRequired";
import logAmplitudeEvent from "../../../common/tracking/amplitude";

const TrekkSoknad = ({ match }) => {
    const [{ data: ad, status: adFetchStatus }, dispatch] = useFetchReducer();
    const [deleteSoknadResponse, deleteSoknadDispatch] = useFetchReducer();

    /**
     * Fetch ad
     */
    useEffect(() => {
        const id = match.params.adUuid;

        dispatch({ type: FetchAction.BEGIN });

        SearchAPI.get(`api/stilling/${id}`)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
            });
    }, []);

    const handleWithDrawClick = () => {
        deleteSoknadDispatch({ type: FetchAction.BEGIN });
        let success = false;
        InterestAPI.deleteInterest(match.params.adUuid, match.params.uuid)
            .then((data) => {
                deleteSoknadDispatch({ type: FetchAction.RESOLVE, data });
                success = true;
            })
            .catch((error) => {
                deleteSoknadDispatch({ type: FetchAction.REJECT, error });
            });
        try {
            logAmplitudeEvent('delete superrask søknad', {
                stillingsId: match.params.adUuid,
                candidateId: match.params.uuid,
                success
            });
        } catch (e) {
            // ignore
        }
    };

    return (
        <div className="InterestMessageDelete">
            {adFetchStatus === FetchStatus.IS_FETCHING && <DelayedSpinner />}

            {(adFetchStatus === FetchStatus.SUCCESS || adFetchStatus === FetchStatus.FAILURE) && (
                <React.Fragment>
                    {deleteSoknadResponse.status !== FetchStatus.SUCCESS ? (
                        <TrekkSoknadConfirmationRequired
                            handleWithDrawClick={handleWithDrawClick}
                            isDeleting={deleteSoknadResponse.status === FetchStatus.IS_FETCHING}
                            hasError={deleteSoknadResponse.status === FetchStatus.FAILURE}
                            ad={adFetchStatus === FetchStatus.SUCCESS ? ad : undefined}
                        />
                    ) : (
                        <TrekkSoknadSuccess />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default TrekkSoknad;

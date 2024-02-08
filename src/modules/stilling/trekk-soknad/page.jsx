/**
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import WithdrawApplication from "../../../app/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplication";
import { FetchAction, useFetchReducer } from "../../../app/_common/hooks/useFetchReducer";
import SearchAPI from "../../../app/_common/api/SearchAPI";
import SuperraskSoknadAPI from "../../../app/stilling/[id]/superrask-soknad/SuperraskSoknadAPI";

function WithdrawApplicationPage({ match }) {
    const [adResponse, dispatch] = useFetchReducer();
    const [applicationStatusDispatch] = useFetchReducer();

    useEffect(() => {
        const id = match.params.adUuid;

        dispatch({ type: FetchAction.BEGIN });

        SearchAPI.get(`api/stilling/${id}`)
            .then((response) => {
                dispatch({ type: FetchAction.RESOLVE, data: response });
            })
            .catch((err) => {
                dispatch({ type: FetchAction.REJECT, error: err });
            });

        SuperraskSoknadAPI.getApplicationStatus(match.params.adUuid, match.params.uuid)
            .then((response) => {
                applicationStatusDispatch({ type: FetchAction.RESOLVE, data: response });
            })
            .catch((err) => {
                applicationStatusDispatch({ type: FetchAction.REJECT, error: err });
            });
    }, []);

    return <WithdrawApplication ad={adResponse.data} adUuid={match.params.adUuid} uuid={match.params.uuid} />;
}

WithdrawApplicationPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string,
            adUuid: PropTypes.string,
        }),
    }),
};

export default WithdrawApplicationPage;
*/

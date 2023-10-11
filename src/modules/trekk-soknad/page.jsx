import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import WithdrawApplication from "./components/WithdrawApplication";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import { FetchAction, FetchStatus, useFetchReducer } from "../../common/hooks/useFetchReducer";
import SearchAPI from "../../common/api/SearchAPI";
import SuperraskSoknadAPI from "../superrask-soknad/api/SuperraskSoknadAPI";
import Loading from "../loading";
import NotFound from "./not-found";
import Error from "../error";

function WithdrawApplicationPage({ match }) {
    const [adResponse, dispatch] = useFetchReducer();
    const [applicationResponse, applicationStatusDispatch] = useFetchReducer();

    useDocumentTitle("Trekk søknad");
    useScrollToTop();

    /**
     * Fetch ad and check if job application exist
     */
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

    if (
        adResponse.status === FetchStatus.NOT_FETCHED ||
        adResponse.status === FetchStatus.IS_FETCHING ||
        applicationResponse.status === FetchStatus.NOT_FETCHED ||
        applicationResponse.status === FetchStatus.IS_FETCHING
    ) {
        return <Loading />;
    }

    if (
        applicationResponse.status === FetchStatus.FAILURE &&
        (applicationResponse.error.statusCode === 410 || applicationResponse.error.statusCode === 404)
    ) {
        return <NotFound />;
    }

    if (applicationResponse.status === FetchStatus.FAILURE) {
        return <Error />;
    }

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

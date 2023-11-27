import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FetchAction, FetchStatus, useFetchReducer } from "../../common/hooks/useFetchReducer";
import SearchAPI from "../../common/api/SearchAPI";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import NotFound from "../../not-found";
import Loading from "../../loading";
import Error from "../../error";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import ReportAd from "./components/ReportAd";

function ReportAdPage({ match }) {
    const [{ data: ad, error, status }, dispatch] = useFetchReducer();

    useDocumentTitle("Rapporter annonse");
    useScrollToTop();

    function fetchStilling(id) {
        dispatch({ type: FetchAction.BEGIN });

        SearchAPI.getAd(id).then(
            (data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            },
            (err) => {
                dispatch({ type: FetchAction.REJECT, error: err });
            },
        );
    }

    useEffect(() => {
        fetchStilling(match.params.id);
    }, []);

    if (status === FetchStatus.NOT_FETCHED || status === FetchStatus.IS_FETCHING) {
        return <Loading />;
    }

    if (status === FetchStatus.FAILURE && error.statusCode === 404) {
        return <NotFound />;
    }

    if (status === FetchStatus.FAILURE) {
        return <Error />;
    }

    return <ReportAd ad={ad} />;
}

ReportAdPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default ReportAdPage;

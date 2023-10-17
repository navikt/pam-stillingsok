import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../common/hooks/useScrollToTop";
import Ad from "./components/Ad";
import { FetchAction, FetchStatus, useFetchReducer } from "../common/hooks/useFetchReducer";
import SearchAPI from "../common/api/SearchAPI";
import NotFound from "./not-found";
import Loading from "../loading";
import Error from "../error";
import useRobotsNoIndexMetaTag from "../common/hooks/useRobotsNoIndexMetaTag";
import { STILLINGSOK_URL } from "../common/environment";
import "./ad.css";

function AdPage({ match }) {
    const [{ data: ad, error, status }, dispatch] = useFetchReducer();
    const avoidIndexing = (error && error.statusCode === 404) || (ad && ad._source.status !== "ACTIVE");
    const shareAdRedirectUrl = `${STILLINGSOK_URL}/${match.params.id}`;

    useScrollToTop();
    useRobotsNoIndexMetaTag(avoidIndexing);

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

    /**
     * Fetch ad when page is loaded
     */
    useEffect(() => {
        fetchStilling(match.params.id);
    }, []);

    /**
     * Set page title after ad is fetched
     */
    useEffect(() => {
        if (ad && ad._source) {
            if (ad._source.title) {
                document.title = `${ad._source.title} - arbeidsplassen.no`;
            }
        }
    }, [ad]);

    if (status === FetchStatus.NOT_FETCHED || status === FetchStatus.IS_FETCHING) {
        return <Loading />;
    }

    if (status === FetchStatus.FAILURE && error.statusCode === 404) {
        return <NotFound />;
    }

    if (status === FetchStatus.FAILURE) {
        return <Error />;
    }

    return <Ad ad={ad} shareAdRedirectUrl={shareAdRedirectUrl} />;
}

AdPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default AdPage;

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import NewApplication from "./components/NewApplication";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import { FetchAction, FetchStatus, useFetchReducer } from "../../common/hooks/useFetchReducer";
import SearchAPI from "../../common/api/SearchAPI";
import SuperraskSoknadAPI from "./api/SuperraskSoknadAPI";
import Loading from "../loading";
import NotFound from "../not-found";
import Error from "../error";

function NewApplicationPage({ match }) {
    const [{ data, status, error }, dispatch] = useFetchReducer();

    useDocumentTitle("Superrask søknad");
    useScrollToTop();

    /**
     * Fetch ad and superrask søknad form
     */
    useEffect(() => {
        const { id } = match.params;

        dispatch({ type: FetchAction.BEGIN });

        const promises = [SearchAPI.get(`api/stilling/${id}`), SuperraskSoknadAPI.getApplicationForm(id)];

        Promise.all(promises)
            .then((responses) => {
                const [ad, applicationForm] = responses;
                dispatch({ type: FetchAction.RESOLVE, data: { ad, applicationForm } });
            })
            .catch((err) => {
                dispatch({ type: FetchAction.REJECT, error: err });
            });
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

    return <NewApplication id={match.params.id} ad={data.ad} applicationForm={data.applicationForm} />;
}

NewApplicationPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default NewApplicationPage;

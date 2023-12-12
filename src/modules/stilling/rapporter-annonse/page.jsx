import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, FetchStatus, useFetchReducer } from "../../common/hooks/useFetchReducer";
import SearchAPI from "../../common/api/SearchAPI";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import NotFound from "../../not-found";
import Loading from "../../loading";
import Error from "../../error";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import ReportAd from "./components/ReportAd";
import UserAPI from "../../common/api/UserAPI";
import logAmplitudeEvent from "../../common/tracking/amplitude";
import APIError from "../../common/api/APIError";
import validateForm from "./components/validate";

function ReportAdPage({ match }) {
    const [{ data: ad, error, status }, dispatch] = useFetchReducer();
    const [validationErrors, setValidationErrors] = useState({});
    const [runningValidationErrors, setRunningValidationErrors] = useState({});
    const [postReportStatus, setPostReportStatus] = useState(FetchStatus.NOT_FETCHED);
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

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

    const validateOnChange = (e) => {
        if (hasTriedSubmit) {
            const formData = new FormData(e);
            const categories = formData.getAll("category");
            const description = formData.get("description");
            const errors = validateForm(categories, description);
            setRunningValidationErrors(errors);
        }
    };

    async function submitForm(e) {
        const formData = new FormData(e.target);
        const categories = formData.getAll("category");
        const description = formData.get("description");
        const errors = validateForm(categories, description);
        setRunningValidationErrors(errors);
        setValidationErrors(errors);
        setHasTriedSubmit(true);

        const isFormDataValid = Object.keys(errors).length === 0;

        if (isFormDataValid) {
            setPostReportStatus(FetchStatus.IS_FETCHING);
            const categoryString = categories.join(", ");
            const title = `En stilling har blitt rapportert for ${categoryString.toLowerCase()}`;

            try {
                await UserAPI.post(
                    "api/v1/reportposting",
                    {
                        category: categoryString,
                        title,
                        postingId: ad._id,
                        description,
                    },
                    false,
                );

                setPostReportStatus(FetchStatus.SUCCESS);

                logAmplitudeEvent("Rapportering av stillingsannonse", {
                    category: categoryString,
                    title,
                    postingId: ad._id,
                });
            } catch (err) {
                if (err instanceof APIError) {
                    setPostReportStatus(FetchStatus.FAILURE);
                } else {
                    throw err;
                }
            }
        }
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

    return (
        <ReportAd
            ad={ad}
            submitForm={submitForm}
            postReportStatus={postReportStatus}
            validationErrors={validationErrors}
            runningValidationErrors={runningValidationErrors}
            validateOnChange={validateOnChange}
        />
    );
}

ReportAdPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default ReportAdPage;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../app/_common/hooks/useFetchReducer";
import SearchAPI from "../../../app/_common/api/SearchAPI";
import ReportAd from "../../../app/stillinger/rapporter-annonse/[id]/_components/ReportAd";
import UserAPI from "../../../app/_common/api/UserAPI";
import logAmplitudeEvent from "../../../app/_common/tracking/amplitude";
import APIError from "../../../app/_common/api/APIError";
import validateForm from "../../../app/stillinger/stilling/[id]/_components/validate";

function ReportAdPage({ match }) {
    const [{ data: ad }, dispatch] = useFetchReducer();
    const [validationErrors, setValidationErrors] = useState({});
    const [postReportStatus, setPostReportStatus] = useState(FetchStatus.NOT_FETCHED);
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

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
            setValidationErrors(errors);
        }
    };

    async function submitForm(e) {
        const formData = new FormData(e.target);
        const categories = formData.getAll("category");
        const description = formData.get("description");
        const errors = validateForm(categories, description);
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

    return (
        <ReportAd
            ad={ad}
            submitForm={submitForm}
            postReportStatus={postReportStatus}
            validationErrors={validationErrors}
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

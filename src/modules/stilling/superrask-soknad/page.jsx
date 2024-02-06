import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import { FetchAction, FetchStatus, useFetchReducer } from "../../common/hooks/useFetchReducer";
import SearchAPI from "../../common/api/SearchAPI";
import SuperraskSoknadAPI from "./api/SuperraskSoknadAPI";
import Loading from "../../loading";
import NotFound from "../../not-found";
import Error from "../../error";
import logAmplitudeEvent from "../../common/tracking/amplitude";
import validateForm, { parseFormData } from "./components/validateForm";
import NewApplication from "./components/NewApplication";

function SuperraskPage({ match }) {
    const defaultState = { success: false, validationErrors: {}, error: undefined, pending: false, data: undefined };
    const { id } = match.params;
    const [{ data, status, error }, dispatch] = useFetchReducer();
    const [submitFormState, setSubmitFormState] = useState(defaultState);

    useDocumentTitle("Superrask søknad");
    useScrollToTop();

    function submitApplication(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const application = parseFormData(formData, data.applicationForm.qualifications);
        const errors = validateForm(application);
        const isAllFormDataValid = Object.keys(errors).length > 0;

        setSubmitFormState({
            ...defaultState,
            validationErrors: errors,
        });

        if (!isAllFormDataValid) {
            setSubmitFormState({
                ...defaultState,
                pending: true,
            });

            SuperraskSoknadAPI.postApplication(id, application)
                .then(() => {
                    setSubmitFormState({
                        ...defaultState,
                        success: true,
                        data: { email: application.email },
                    });
                })
                .catch((err) => {
                    setSubmitFormState({
                        ...defaultState,
                        error: err.message,
                    });
                });

            try {
                logAmplitudeEvent("submit superrask søknad", {
                    numberOfQualifications: data.applicationForm.qualifications.length,
                    numberOfQualificationsChecked: application.qualifications.length,
                    motivationLength: application.motivation.length,
                    hasName: application.name.length > 0,
                });
            } catch (err) {
                // ignore
            }
        }
    }

    /**
     * Fetch ad and superrask søknad form
     */
    useEffect(() => {
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

    return (
        <NewApplication
            submitForm={submitApplication}
            ad={data.ad}
            applicationForm={data.applicationForm}
            submitFormState={submitFormState}
        />
    );
}

SuperraskPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default SuperraskPage;

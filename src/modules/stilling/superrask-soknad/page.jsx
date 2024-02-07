import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, useFetchReducer } from "../../../app/_common/hooks/useFetchReducer";
import SearchAPI from "../../../app/_common/api/SearchAPI";
import SuperraskSoknadAPI from "../../../app/stillinger/stilling/[id]/superrask-soknad/SuperraskSoknadAPI";
import logAmplitudeEvent from "../../../app/_common/tracking/amplitude";
import validateForm, {
    parseFormData,
} from "../../../app/stillinger/stilling/[id]/superrask-soknad/_components/validateForm";
import NewApplication from "../../../app/stillinger/stilling/[id]/superrask-soknad/_components/NewApplication";

function SuperraskPage({ match }) {
    const defaultState = { success: false, validationErrors: {}, error: undefined, pending: false, data: undefined };
    const { id } = match.params;
    const [{ data }, dispatch] = useFetchReducer();
    const [submitFormState, setSubmitFormState] = useState(defaultState);

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

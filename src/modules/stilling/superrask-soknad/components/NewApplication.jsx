import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Label } from "@navikt/ds-react";
import SuperraskSoknadAPI from "../api/SuperraskSoknadAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import getEmployer from "../../../../../server/common/getEmployer";
import NewApplicationForm from "./NewApplicationForm";
import NewApplicationSuccess from "./NewApplicationSuccess";
import logAmplitudeEvent from "../../../common/tracking/amplitude";

function NewApplication({ id, ad, applicationForm }) {
    const [postApplicationResponse, postApplicationDispatch] = useFetchReducer();

    function submitApplication(application) {
        postApplicationDispatch({ type: FetchAction.BEGIN });
        SuperraskSoknadAPI.postApplication(id, application)
            .then(() => {
                postApplicationDispatch({ type: FetchAction.RESOLVE, data: application });
            })
            .catch((err) => {
                postApplicationDispatch({ type: FetchAction.REJECT, error: err });
            });

        try {
            logAmplitudeEvent("submit superrask søknad", {
                id: ad._id,
                numberOfQualifications: application.qualifications.length,
                numberOfQualificationsChecked: application.qualifications.filter((it) => it.checked).length,
                motivationLength: application.motivation.length,
                hasName: application.name.length > 0,
            });
        } catch (e) {
            // ignore
        }
    }

    return (
        <div className="mb-16">
            <Box background="surface-alt-1-subtle" paddingBlock="4" className="mb-12">
                <div className="container-medium">
                    <Label as="p" className="mb-1">
                        {getEmployer(ad._source)}
                    </Label>
                    <BodyShort>{ad._source.title}</BodyShort>
                </div>
            </Box>
            <div className="container-small">
                {postApplicationResponse.status !== FetchStatus.SUCCESS && (
                    <NewApplicationForm
                        ad={ad}
                        applicationForm={applicationForm}
                        submitForm={submitApplication}
                        isSending={postApplicationResponse.status === FetchStatus.IS_FETCHING}
                        hasError={postApplicationResponse.status === FetchStatus.FAILURE}
                        error={postApplicationResponse.error}
                    />
                )}

                <div aria-live="polite">
                    {postApplicationResponse.status === FetchStatus.SUCCESS && (
                        <NewApplicationSuccess data={postApplicationResponse.data} />
                    )}
                </div>
            </div>
        </div>
    );
}

NewApplication.propTypes = {
    id: PropTypes.string,
    ad: PropTypes.shape({}),
    applicationForm: PropTypes.shape({}),
};

export default NewApplication;

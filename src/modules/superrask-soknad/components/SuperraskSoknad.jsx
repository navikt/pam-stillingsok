import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Alert, BodyShort, Label } from "@navikt/ds-react";
import { NotFound } from "@navikt/arbeidsplassen-react";
import SearchAPI from "../../../common/api/SearchAPI";
import SuperraskSoknadAPI from "../api/SuperraskSoknadAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import "./SuperraskSoknad.css";
import getEmployer from "../../../../server/common/getEmployer";
import NewApplicationForm from "./NewApplicationForm";
import NewApplicationSuccess from "./NewApplicationSuccess";
import logAmplitudeEvent from "../../../common/tracking/amplitude";

function SuperraskSoknad({ match }) {
    const [{ data, status, error }, dispatch] = useFetchReducer();
    const [postApplicationResponse, postApplicationDispatch] = useFetchReducer();

    /**
     * Fetch ad and superrask søknad form
     */
    useEffect(() => {
        const id = match.params.uuid;

        dispatch({ type: FetchAction.BEGIN });

        const promises = [SearchAPI.get(`api/stilling/${id}`), SuperraskSoknadAPI.getApplicationForm(id)];

        Promise.all(promises)
            .then((responses) => {
                const [ad, applicationForm] = responses;
                dispatch({ type: FetchAction.RESOLVE, data: { ad, applicationForm } });
            })
            .catch((err) => {
                dispatch({ type: FetchAction.REJECT, error: err });
                // prettier-ignore
                // dispatch({ type: FetchAction.RESOLVE, data: { ad: {"_index":"ad_20220104_085008","_type":"_doc","_id":"2b9646a9-45b2-4e48-9544-eec3ccb8ccfc","_version":14,"_seq_no":1050519,"_primary_term":2,"found":true,"_source":{"expires":"2023-01-31T00:00:00+01:00","country_facet":["NORGE"],"businessName":"Tangen Og Øksendal","source":"Stillingsregistrering","medium":"Stillingsregistrering","published":"2023-01-25T00:00:00+01:00","title":"Epost-bug test","reference":"2b9646a9-45b2-4e48-9544-eec3ccb8ccfc","locationList":[{"address":null,"postalCode":"3215","country":"NORGE","county":"VESTFOLD OG TELEMARK","municipal":"SANDEFJORD","city":"SANDEFJORD","latitude":null,"longitude":null}],"contactList":[],"employer":null,"location":{"country":"NORGE","address":null,"city":"SANDEFJORD","postalCode":"3215","municipal":"SANDEFJORD"},"id":785756,"updated":"2023-01-25T08:48:00.620665+01:00","properties":{"extent":"Heltid","workhours":"[\"Dagtid\"]","workday":"[\"Ukedager\"]","applicationdue":"Snarest","jobtitle":"Tester","positioncount":"1","engagementtype":"Vikariat","classification_styrk08_score":"0.45387174022090926","_approvedby":"AUTO","_score":"[{\"name\":\"category\",\"value\":-50},{\"name\":\"employer\",\"value\":-50},{\"name\":\"jobarrangement\",\"value\":-10},{\"name\":\"jobpercentage\",\"value\":-10},{\"name\":\"keywords\",\"value\":-10},{\"name\":\"applicationurl\",\"value\":-10},{\"name\":\"employerdescription\",\"value\":-10}]","adtext":"<p>Dette er en test :)</p>\n","hasInterestform":"true","classification_styrk08_code":"7543","employer":"Tangen Og Øksendal","ontologyJobtitle":"{\"konseptId\":109237,\"label\":\"Tester\",\"styrk08\":\"7543\"}","classification_input_source":"ontologyJobtitle","sector":"Ikke oppgitt","_scoretotal":"-150"},"status":"ACTIVE"}}, applicationForm: {"adId":"2b9646a9-45b2-4e48-9544-eec3ccb8ccfc","qualifications":[{"id":"9cb90e1e-648e-4878-baf9-cafbc00b8c33","label":"Test"}, {"id":"9cb90e1e-648e-4878-baf9-cafbc00b8c34","label":"Test 2"}]} } });
            });
    }, []);

    function submitApplication(application) {
        postApplicationDispatch({ type: FetchAction.BEGIN });
        SuperraskSoknadAPI.postApplication(match.params.uuid, application)
            .then(() => {
                postApplicationDispatch({ type: FetchAction.RESOLVE, data: application });
            })
            .catch((err) => {
                postApplicationDispatch({ type: FetchAction.REJECT, error: err });
            });

        try {
            logAmplitudeEvent("submit superrask søknad", {
                id: data.ad._id,
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
        <div className="NewApplicationForm">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && error.statusCode !== 404 && (
                <div className="container-small mt-4 mb-4">
                    <Alert variant="error">Det oppsto dessverre en feil. Prøv å last inn siden på nytt.</Alert>
                </div>
            )}

            {status === FetchStatus.FAILURE && error.statusCode === 404 && <NotFound className="mt-12" />}

            {status === FetchStatus.SUCCESS && (
                <>
                    <div className="NewApplicationForm__green-box">
                        <div className="NewApplicationForm__green-box-inner">
                            <Label as="p" className="mb-1">
                                {getEmployer(data.ad._source)}
                            </Label>
                            <BodyShort>{data.ad._source.title}</BodyShort>
                        </div>
                    </div>
                    <div className="container-small">
                        {postApplicationResponse.status !== FetchStatus.SUCCESS && (
                            <NewApplicationForm
                                ad={data.ad}
                                applicationForm={data.applicationForm}
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
                </>
            )}
        </div>
    );
}

SuperraskSoknad.defaultProps = {
    match: { params: {} },
};

SuperraskSoknad.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string,
        }),
    }),
};

export default SuperraskSoknad;

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import SearchAPI from "../../../common/api/SearchAPI";
import InterestAPI from "../api/InterestAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import Alert from "../../../common/components/alert/Alert";
import "./SuperraskSoknad.css";
import getEmployer from "../../../../server/common/getEmployer";
import { CONTEXT_PATH } from "../../../common/environment";
import BackLink from "../../../common/components/backlink/BackLink";
import NotFound404 from "../../../common/components/NotFound/NotFound404";
import SuperraskSoknadForm from "./SuperraskSoknadForm";
import SuperraskSoknadSuccess from "./SuperraskSoknadSuccess";
import logAmplitudeEvent from "../../../common/tracking/amplitude";

const SuperraskSoknad = ({ match }) => {
    const [{ data, status, error }, dispatch] = useFetchReducer();
    const [postSoknadResponse, postSoknadDispatch] = useFetchReducer();
    const isInternal = match.path.startsWith("/stillinger/intern/");

    /**
     * Fetch ad and superrask søknad form
     */
    useEffect(() => {
        const id = match.params.uuid;
        const path = isInternal ? "intern" : "stilling";

        dispatch({ type: FetchAction.BEGIN });

        const promises = [SearchAPI.get(`api/${path}/${id}`), InterestAPI.getInterestForm(id)];

        Promise.all(promises)
            .then((responses) => {
                const [ad, interestForm] = responses;
                dispatch({ type: FetchAction.RESOLVE, data: { ad, interestForm } });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
                //dispatch({ type: FetchAction.RESOLVE, data: { ad: {"_index":"ad_20220104_085008","_type":"_doc","_id":"2b9646a9-45b2-4e48-9544-eec3ccb8ccfc","_version":14,"_seq_no":1050519,"_primary_term":2,"found":true,"_source":{"expires":"2023-01-31T00:00:00+01:00","country_facet":["NORGE"],"businessName":"Tangen Og Øksendal","source":"Stillingsregistrering","medium":"Stillingsregistrering","published":"2023-01-25T00:00:00+01:00","title":"Epost-bug test","reference":"2b9646a9-45b2-4e48-9544-eec3ccb8ccfc","locationList":[{"address":null,"postalCode":"3215","country":"NORGE","county":"VESTFOLD OG TELEMARK","municipal":"SANDEFJORD","city":"SANDEFJORD","latitude":null,"longitude":null}],"contactList":[],"employer":null,"location":{"country":"NORGE","address":null,"city":"SANDEFJORD","postalCode":"3215","municipal":"SANDEFJORD"},"id":785756,"updated":"2023-01-25T08:48:00.620665+01:00","properties":{"extent":"Heltid","workhours":"[\"Dagtid\"]","workday":"[\"Ukedager\"]","applicationdue":"Snarest","jobtitle":"Tester","positioncount":"1","engagementtype":"Vikariat","classification_styrk08_score":"0.45387174022090926","_approvedby":"AUTO","_score":"[{\"name\":\"category\",\"value\":-50},{\"name\":\"employer\",\"value\":-50},{\"name\":\"jobarrangement\",\"value\":-10},{\"name\":\"jobpercentage\",\"value\":-10},{\"name\":\"keywords\",\"value\":-10},{\"name\":\"applicationurl\",\"value\":-10},{\"name\":\"employerdescription\",\"value\":-10}]","adtext":"<p>Dette er en test :)</p>\n","hasInterestform":"true","classification_styrk08_code":"7543","employer":"Tangen Og Øksendal","ontologyJobtitle":"{\"konseptId\":109237,\"label\":\"Tester\",\"styrk08\":\"7543\"}","classification_input_source":"ontologyJobtitle","sector":"Ikke oppgitt","_scoretotal":"-150"},"status":"ACTIVE"}}, interestForm: {"stillingsId":"2b9646a9-45b2-4e48-9544-eec3ccb8ccfc","must":[],"should":[{"id":"9cb90e1e-648e-4878-baf9-cafbc00b8c33","label":"Test"}]} } });
            });
    }, []);

    function submitSoknad(soknad) {
        postSoknadDispatch({ type: FetchAction.BEGIN });
        InterestAPI.postInterest(match.params.uuid, soknad)
            .then(() => {
                postSoknadDispatch({ type: FetchAction.RESOLVE, data: soknad });
            })
            .catch((error) => {
                postSoknadDispatch({ type: FetchAction.REJECT, error });
            });

        try {
            logAmplitudeEvent("submit superrask søknad", {
                id: data.ad._id,
                antallKrav: (soknad.must.length + soknad.should.length),
                antallKravHuket: (soknad.must.filter(it => it.checked).length + soknad.should.filter(it => it.checked).length),
                antallTegnIFritekst: soknad.about.length,
                harNavn: (soknad.name.length > 0)
            });
        } catch (e) {
            // ignore
        }
    }

    return (
        <div className="InterestForm">
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}

            {status === FetchStatus.FAILURE && error.statusCode !== 404 && (
                <div className="InterestForm__inner">
                    <Alert>Det oppsto dessverre en feil. Prøv å last inn siden på nytt.</Alert>
                </div>
            )}

            {status === FetchStatus.FAILURE && error.statusCode === 404 && (
                <NotFound404
                    title="Vi fant dessverre ikke innholdet du ser etter"
                    text="Det kan være en feil i lenken du brukte, eller så kan bedriften ha avsluttet søknadsprosessen for denne stillingen."
                />
            )}

            {status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <div className="InterestForm__green-box">
                        <div className="InterestForm__green-box-inner">
                            <p className="InterestForm__employer">{getEmployer(data.ad._source)}</p>
                            <p className="InterestForm__job-title">{data.ad._source.title}</p>
                        </div>
                    </div>
                    {postSoknadResponse.status !== FetchStatus.SUCCESS && (
                        <div className="InterestForm__backlink">
                            <BackLink
                                to={`${CONTEXT_PATH}/${isInternal ? "intern" : "stilling"}/${data.ad._id}`}
                                text="Tilbake"
                            />
                        </div>
                    )}
                    <div className="InterestForm__inner">
                        {postSoknadResponse.status !== FetchStatus.SUCCESS && (
                            <SuperraskSoknadForm
                                ad={data.ad}
                                interestForm={data.interestForm}
                                isInternal={isInternal}
                                submitForm={submitSoknad}
                                isSending={postSoknadResponse.status === FetchStatus.IS_FETCHING}
                                hasError={postSoknadResponse.status === FetchStatus.FAILURE}
                                error={postSoknadResponse.error}
                            />
                        )}

                        <div aria-live="polite">
                            {postSoknadResponse.status === FetchStatus.SUCCESS && (
                                <SuperraskSoknadSuccess data={postSoknadResponse.data} />
                            )}
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

SuperraskSoknad.defaultProps = {
    match: { params: {} }
};

SuperraskSoknad.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    })
};

export default SuperraskSoknad;

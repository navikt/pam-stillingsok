import React, { useEffect } from "react";
import { Hovedknapp } from "@navikt/arbeidsplassen-knapper";
import { FetchAction, FetchStatus, useFetchReducer } from "../../common/hooks/useFetchReducer";
import SearchAPI from "../../common/api/SearchAPI";
import { captureException } from "@sentry/browser";
import DelayedSpinner from "../../common/components/spinner/DelayedSpinner";
import Alert from "../../common/components/alert/Alert";
import getEmployer from "../../../server/common/getEmployer";
import { CONTEXT_PATH } from "../../common/environment";
import { Link } from "react-router-dom";
import InterestAPI from "../../common/api/InterestAPI";
import Spinner from "nav-frontend-spinner";

const TrekkSoknad = ({ match }) => {
    const [{ data: ad, status: adFetchStatus }, dispatch] = useFetchReducer();
    const [deleteInterestResponse, deleteInterestDispatch] = useFetchReducer();

    /**
     * Fetch ad
     */
    useEffect(() => {
        const id = match.params.adUuid;

        dispatch({ type: FetchAction.BEGIN });

        SearchAPI.get(`api/stilling/${id}`)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }, []);

    const handleTrekkSoknadClick = () => {
        deleteInterestDispatch({ type: FetchAction.BEGIN });
        InterestAPI.deleteInterest(match.params.adUuid, match.params.uuid)
            .then((data) => {
                deleteInterestDispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                captureException(error);
                deleteInterestDispatch({ type: FetchAction.REJECT, error });
            });
    };

    return (
        <div className="InterestMessageDelete">
            {adFetchStatus === FetchStatus.IS_FETCHING && <DelayedSpinner />}

            {(adFetchStatus === FetchStatus.SUCCESS || adFetchStatus === FetchStatus.FAILURE) && (
                <React.Fragment>
                    {deleteInterestResponse.status !== FetchStatus.SUCCESS ? (
                        <React.Fragment>
                            <h1 className="InterestForm__h1">Bekreft at du ønsker å trekke din søknad</h1>
                            <p className="InterestForm__p InterestForm__mb-2">
                                Informasjonen du har oppgitt i din søknad vil bli slettet. Dette valget kan ikke angres
                                og du må søke på nytt dersom du ønsker det.
                            </p>
                            {adFetchStatus === FetchStatus.SUCCESS && (
                                <div className="InterestMessageDelete__ad">
                                    <p className="InterestMessageDelete__ad-title">
                                        <Link to={`${CONTEXT_PATH}/stilling/${ad._id}`} className="link">
                                            {ad._source.title}
                                        </Link>
                                    </p>
                                    <p className="InterestForm__employer">{getEmployer(ad._source)}</p>
                                </div>
                            )}

                            {deleteInterestResponse.status === FetchStatus.FAILURE && (
                                <div className="InterestForm__mb-2">
                                    <Alert>
                                        Det oppsto dessverre en feil og vi kunne ikke trekke søknaden din. Prøv å trekk
                                        søknaden på nytt.
                                    </Alert>
                                </div>
                            )}
                            {deleteInterestResponse.status === FetchStatus.IS_FETCHING ? (
                                <div aria-live="polite" className="InterestForm__progress">
                                    <Spinner type="S" /> Trekker søknad
                                </div>
                            ) : (
                                <Hovedknapp
                                    onClick={handleTrekkSoknadClick}
                                    spinner={deleteInterestResponse.status === FetchStatus.IS_FETCHING}
                                    disabled={deleteInterestResponse.status === FetchStatus.IS_FETCHING}
                                >
                                    Trekk søknad
                                </Hovedknapp>
                            )}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <h1 className="InterestForm__h1" aria-live="polite" role="alert">
                                Din søknad er nå trukket
                            </h1>
                            <p className="InterestForm__p InterestForm__mb-2">
                                Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk
                                søknaden, kan du søke på nytt.
                            </p>
                            <Link to={CONTEXT_PATH} className="Knapp">
                                Se ledige stillinger
                            </Link>
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default TrekkSoknad;

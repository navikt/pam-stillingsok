import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Tag } from "@navikt/ds-react";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import FinnAd from "./FinnAd";
import HowToApply from "./HowToApply";
import "./Ad.css";
import { logStillingVisning } from "../../../common/tracking/amplitude";
import ShareAd from "./ShareAd";
import Summary from "./Summary";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import SearchAPI from "../../../common/api/SearchAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import useRobotsNoIndexMetaTag from "../../../common/hooks/useRobotsNoIndexMetaTag";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import NotFound404 from "../../../common/components/NotFound/NotFound404";

function Ad({ match }) {
    const [{ data: ad, error, status }, dispatch] = useFetchReducer();
    const avoidIndexing = (error && error.statusCode === 404) || (ad && ad._source.status !== "ACTIVE");

    useRobotsNoIndexMetaTag(avoidIndexing);

    function fetchStilling(id) {
        dispatch({ type: FetchAction.BEGIN });

        SearchAPI.get(`api/stilling/${id}`).then(
            (data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            },
            (err) => {
                dispatch({ type: FetchAction.REJECT, error: err });
            },
        );
    }

    /**
     * Fetch ad
     */
    useEffect(() => {
        fetchStilling(match.params.uuid);
    }, []);

    /**
     * Set page title
     */
    useEffect(() => {
        if (ad && ad._source) {
            if (ad._source.title) {
                document.title = `${ad._source.title} - arbeidsplassen.no`;
            }
        }
    }, [ad]);

    /**
     * Track page view for all ads
     */
    useEffect(() => {
        if (ad && ad._source && ad._id && ad._source.title) {
            try {
                logStillingVisning(ad);
            } catch (e) {
                // ignore
            }
        }
    }, [ad]);

    const isFinn = ad && ad._source && ad._source.source && ad._source.source.toLowerCase() === "finn";

    return (
        <div className="container-large JobPosting">
            {status === FetchStatus.FAILURE && error.statusCode === 404 && (
                <NotFound404
                    title="Vi fant dessverre ikke stillingsannonsen"
                    text="Annonsen kan være utløpt eller blitt fjernet av arbeidsgiver."
                />
            )}
            {status === FetchStatus.FAILURE && error.statusCode !== 404 && <ErrorMessage />}
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.SUCCESS && (
                <article className="JobPosting__flex">
                    <div className="JobPosting__left">
                        <H1WithAutoFocus className="JobPosting__h1">{ad._source.title}</H1WithAutoFocus>

                        {ad._source.status !== "ACTIVE" && (
                            <Tag variant="warning-filled" className="mb-1">
                                Stillingsannonsen er inaktiv.
                            </Tag>
                        )}

                        {isFinn && <FinnAd stilling={ad} />}

                        {!isFinn && (
                            <>
                                <Summary stilling={ad._source} />
                                <AdText adText={ad._source.properties.adtext} />
                                <EmployerDetails stilling={ad._source} />
                                <EmploymentDetails stilling={ad._source} />
                            </>
                        )}
                    </div>

                    <div className="JobPosting__right">
                        <HowToApply stilling={ad} showFavouriteButton />
                        {!isFinn && (
                            <ContactPerson
                                contactList={ad._source.contactList}
                                adId={ad._id}
                                adTitle={ad._source.title}
                            />
                        )}
                        {!isFinn && <ShareAd source={ad._source} />}
                        <AdDetails id={ad._id} source={ad._source} />
                    </div>
                </article>
            )}
        </div>
    );
}

Ad.defaultProps = {
    match: { params: {} },
};

Ad.propTypes = {
    match: PropTypes.shape({
        path: PropTypes.string,
        params: PropTypes.shape({
            uuid: PropTypes.string,
        }),
    }),
};

export default Ad;

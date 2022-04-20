import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {captureException} from "@sentry/browser";
import { Column, Container, Row } from "nav-frontend-grid";
import { CONTEXT_PATH } from "../../environment";
import AdDetails from "./adDetails/AdDetails";
import AdText from "./adText/AdText";
import ContactPerson from "./contactPerson/ContactPerson";
import EmployerDetails from "./employerDetails/EmployerDetails";
import EmploymentDetails from "./employmentDetails/EmploymentDetails";
import Expired from "./expired/Expired";
import FinnAd from "./finnAd/FinnAd";
import HowToApply from "./howToApply/HowToApply";
import NotFound from "./notFound/NotFound";
import HardRequirements from "./requirements/HardRequirements";
import PersonalAttributes from "./requirements/PersonalAttributes";
import SoftRequirements from "./requirements/SoftRequirements";
import "./Ad.less";
import logAmplitudeEvent, { logAmplitudePageview } from "../../api/amplitude/amplitude";
import ShareAd from "./shareAd/ShareAd";
import Summary from "./summary/Summary";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import { get } from "../../api/search/api";
import { FetchAction, FetchStatus, useFetchReducer } from "../../hooks/useFetchReducer";
import ErrorMessage from "../../components/messages/ErrorMessage";
import useRobotsNoIndexMetaTag from "../../hooks/useRobotsNoIndexMetaTag";
import useScrollToTop from "../../hooks/useScrollToTop";

const Ad = ({ match }) => {
    const [{ data: ad, error, status }, dispatch] = useFetchReducer();
    const isInternal = match.path.startsWith("/stillinger/intern/");
    const avoidIndexing = (error && error.statusCode === 404) || (ad && ad._source.status !== "ACTIVE") || isInternal;

    useScrollToTop();
    useRobotsNoIndexMetaTag(avoidIndexing);

    function fetchStilling(id) {
        dispatch({ type: FetchAction.BEGIN });

        const path = isInternal ? "intern" : "stilling";
        get(`${CONTEXT_PATH}/api/${path}/${id}`)
            .then(data => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch(error => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    useEffect(() => {
        fetchStilling(match.params.uuid);
    }, []);

    useEffect(() => {
        if (ad && ad._source && ad._source.title) {
            document.title = `${ad._source.title} - Arbeidsplasssen`;
        }
    }, [ad]);

    useEffect(() => {
        if (isInternal) {
            return;
        }
        if (ad && ad._source && ad._id && ad._source.title) {
            try {
                logAmplitudePageview();
            } catch (e) {
                // ignore
            }

            try {
                logAmplitudeEvent("Stilling visning", {
                    title: ad._source.title || "N/A",
                    id: ad._id,
                    businessName: ad._source.businessName || "N/A",
                    country: ad._source.employer.location.country || "N/A",
                    county: ad._source.employer.location.county || "N/A",
                    city: ad._source.employer.location.city || "N/A",
                    employer: ad._source.employer.name || "N/A",
                    expires: ad._source.expires || "N/A",
                    published: ad._source.published || "N/A"
                });
            } catch (e) {
                // ignore
            }
        }
    }, [ad]);

    const isFinn = ad && ad._source && ad._source.source && ad._source.source.toLowerCase() === "finn";

    return (
        <div className="Stilling">
            {status === FetchStatus.FAILURE && error.statusCode === 404 && <NotFound />}
            {status === FetchStatus.FAILURE && error.statusCode !== 404 && <ErrorMessage />}
            {status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {status === FetchStatus.SUCCESS && (
                <Container>
                    <Row>
                        <Column xs="12" md="7" lg="8">
                            <div className="Stilling__left">
                                {ad._source.status !== "ACTIVE" && <Expired />}
                                <h1 className="Stilling__h1">{ad._source.title}</h1>
                                {isFinn && <FinnAd stilling={ad} />}
                                {!isFinn && (
                                    <React.Fragment>
                                        <Summary stilling={ad._source} />
                                        <AdText adText={ad._source.properties.adtext} />
                                        <HardRequirements stilling={ad} />
                                        <SoftRequirements stilling={ad} />
                                        <PersonalAttributes stilling={ad} />
                                        <EmployerDetails stilling={ad._source} />
                                    </React.Fragment>
                                )}
                            </div>
                        </Column>
                        <Column xs="12" md="5" lg="4">
                            <HowToApply stilling={ad} showFavouriteButton={!isInternal} />
                            {!isFinn && (
                                <React.Fragment>
                                    <EmploymentDetails stilling={ad._source} />
                                    <ContactPerson contactList={ad._source.contactList} />
                                    {!isInternal && <ShareAd source={ad._source} />}
                                </React.Fragment>
                            )}
                            <AdDetails id={ad._id} source={ad._source} />
                        </Column>
                    </Row>
                </Container>
            )}
        </div>
    );
};

Ad.defaultProps = {
    match: { params: {} }
};

Ad.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    })
};

export default Ad;

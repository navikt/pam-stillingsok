/* eslint-disable no-underscore-dangle,prefer-destructuring */
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Flatknapp, Lenkeknapp} from '@navikt/arbeidsplassen-knapper';
import {Column, Container, Row} from 'nav-frontend-grid';
import BackLink from '../backLink/BackLink';
import getEmployer from '../../server/common/getEmployer';
import getWorkLocation from '../../server/common/getWorkLocation';
import {CONTEXT_PATH} from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import ToggleFavouriteButton from '../favourites/toggleFavoriteButton/ToggleFavouriteButton';
import {parseQueryString, stringifyQueryObject} from '../utils';
import AdDetails from './adDetails/AdDetails';
import AdText from './adText/AdText';
import ContactPerson from './contactPerson/ContactPerson';
import EmployerDetails from './employerDetails/EmployerDetails';
import EmploymentDetails from './employmentDetails/EmploymentDetails';
import Expired from './expired/Expired';
import FinnAd from './finnAd/FinnAd';
import HowToApply from './howToApply/HowToApply';
import Loading from './loading/Loading';
import NotFound from './notFound/NotFound';
import HardRequirements from './requirements/HardRequirements';
import PersonalAttributes from './requirements/PersonalAttributes';
import SoftRequirements from './requirements/SoftRequirements';
import SocialShare from './socialShare/SocialShare';
import './Stilling.less';
import {FETCH_STILLING_BEGIN, RESET_STILLING} from './stillingReducer';
import {useScrollToTop} from '../common/hooks';
import {sendUrlEndring} from "../common/hooks/useTrackPageview";
import {addRobotsNoIndexMetaTag, removeRobotsMetaTag} from '../common/utils/metaRobots';
import logAmplitudeEvent, {logAmplitudePageview} from "../amplitudeTracker";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

function commaSeparate(...strings) {
    const onlyStrings = strings.filter((string) => (
        typeof string === 'string'
    ));
    return onlyStrings.join(', ');
}

const Stilling = ({cachedStilling, error, getStilling, isFetchingStilling, match, stilling, resetStilling}) => {

    useScrollToTop();

    useEffect(() => {
        let uuidParam = match.params.uuid;
        if (!uuidParam) {
            // Om man logget inn mens man var inne på en stillingsannonse, så vil loginservice
            // redirecte til en url med dette url-formatet: '/stillinger/stilling?uuid=12345'.
            // Redirecter derfor til riktig url-format: '/stillinger/stilling/:uuid'
            // @see src/authentication/authenticationReducer.js
            const {uuid, ...otherQueryParams} = parseQueryString(document.location.search);

            if (uuid && typeof uuid === "string") {
                window.history.replaceState({}, '', `${CONTEXT_PATH}/stilling/${uuid}${stringifyQueryObject(otherQueryParams)}`);
                getStilling(uuid);
            }
        } else {
            getStilling(uuidParam);
        }
        return () => {
            resetStilling();
        }
    }, []);

    useEffect(() => {
        if (stilling && stilling._source && stilling._id && stilling._source.title) {
            document.title = stilling._source.title;

            try {
                ga('set', 'page', `${CONTEXT_PATH}/stilling/${stilling._id}`);
                ga('set', 'title', stilling._source.title);
                ga('send', 'pageview');
                logAmplitudePageview();
            } catch (e) {
                // ignore
            }

            try {
                logAmplitudeEvent('Stilling visning', {
                    title: stilling._source.title || "N/A",
                    id: stilling._id,
                    businessName: stilling._source.businessName || "N/A",
                    country: stilling._source.employer.location.country || "N/A",
                    county: stilling._source.employer.location.county || "N/A",
                    city: stilling._source.employer.location.city || "N/A",
                    employer: stilling._source.employer.name || "N/A",
                    expires: stilling._source.expires || "N/A",
                    published: stilling._source.published || "N/A"
                })
            } catch (e) {
                // ignore
            }

            sendUrlEndring({page: `${CONTEXT_PATH}/stilling`, source: stilling._source.source});
        }
    }, [stilling]);

    useEffect(() => {
        const pageNotFound = error && error.statusCode === 404;
        const adIsNotActive = !isFetchingStilling && stilling && stilling._source.status !== 'ACTIVE';
        if (pageNotFound || adIsNotActive) {
            addRobotsNoIndexMetaTag()
        }
        return () => {
            removeRobotsMetaTag();
        }
    }, [error, isFetchingStilling, stilling]);


    const onPrintClick = () => {
        window.print();
    };

    const isFinn = stilling && stilling._source && stilling._source.source && stilling._source.source.toLowerCase() === 'finn';

    return (
        <div className="Stilling">
            <a id="main-content" tabIndex="-1" />
            <FavouriteAlertStripe/>

            {error && error.statusCode === 404 && (
                <NotFound/>
            )}

            {!error && (
                <Container>
                    <Row>
                        <Column xs="12">
                            <div className="Stilling__header">
                                <BackLink/>
                                <div className="Stilling__buttons">
                                    {isFetchingStilling && cachedStilling && (
                                        <ToggleFavouriteButton uuid={cachedStilling.uuid}/>
                                    )}
                                    {!isFetchingStilling && stilling && (
                                        <ToggleFavouriteButton uuid={stilling._id}/>
                                    )}
                                    <Flatknapp
                                        mini
                                        className="Stilling__print"
                                        onClick={onPrintClick}
                                    >
                                        Skriv ut
                                    </Flatknapp>
                                </div>
                            </div>
                        </Column>
                    </Row>
                    <Row>
                        <Column xs="12" md="7" lg="8">
                            <div className="Stilling__left">
                                {!isFetchingStilling && stilling && stilling._source.status !== 'ACTIVE' && (
                                    <Expired/>
                                )}
                                {isFetchingStilling && cachedStilling && (
                                    <React.Fragment>
                                        <div className="Stilling__employer-and-location">
                                            {commaSeparate(getEmployer(cachedStilling), getWorkLocation(
                                                cachedStilling.properties.location,
                                                cachedStilling.locationList
                                            ))}
                                        </div>
                                        <h1 className="Stilling__h1">
                                            {cachedStilling.title}
                                        </h1>
                                    </React.Fragment>
                                )}
                                {!isFetchingStilling && stilling && (
                                    <React.Fragment>
                                        <div className="Stilling__employer-and-location">
                                            {commaSeparate(getEmployer(stilling._source), getWorkLocation(
                                                stilling._source.properties.location,
                                                stilling._source.locationList
                                            ))}
                                        </div>
                                        <h1 className="Stilling__h1">
                                            {stilling._source.title}
                                        </h1>
                                    </React.Fragment>
                                )}
                                {(stilling === undefined || isFetchingStilling) && (
                                    <Loading/>
                                )}
                                {!isFetchingStilling && stilling && isFinn && (
                                    <FinnAd stilling={stilling}/>
                                )}
                                {!isFetchingStilling && stilling && !isFinn && (
                                    <React.Fragment>
                                        <AdText adText={stilling._source.properties.adtext}/>
                                        <HardRequirements stilling={stilling}/>
                                        <SoftRequirements stilling={stilling}/>
                                        <PersonalAttributes stilling={stilling}/>
                                        <SocialShare title={stilling._source.title}/>
                                    </React.Fragment>
                                )}
                                {stilling !== undefined &&
                                <div className="Rapport__link">
                                    <Link
                                        className={"link"}
                                        to={`${CONTEXT_PATH}/rapporter-annonse?uuid=${stilling._id}`}
                                        aria-label="Rapporter annonse"
                                    >
                                        Rapporter annonse
                                    </Link>
                                </div>
                                }
                            </div>
                        </Column>
                        <Column xs="12" md="5" lg="4">
                            {(stilling === undefined || isFetchingStilling) && (
                                <Loading spinner={false}/>
                            )}
                            {!isFetchingStilling && stilling && !isFinn && (
                                <React.Fragment>
                                    <HowToApply
                                        source={stilling._source.source}
                                        properties={stilling._source.properties}
                                    />
                                    <EmploymentDetails stilling={stilling._source}/>
                                    <ContactPerson contactList={stilling._source.contactList}/>
                                    <EmployerDetails stilling={stilling._source}/>
                                    <AdDetails source={stilling._source}/>
                                </React.Fragment>
                            )}
                        </Column>
                    </Row>
                </Container>
            )}
        </div>
    );
};

Stilling.defaultProps = {
    stilling: undefined,
    cachedStilling: undefined,
    isFetchingStilling: false,
    error: undefined,
    match: {params: {}}
};

Stilling.propTypes = {
    stilling: PropTypes.shape({
        _source: PropTypes.shape({
            status: PropTypes.string,
            title: PropTypes.string,
            properties: PropTypes.shape({
                adtext: PropTypes.string
            })
        })
    }),
    cachedStilling: PropTypes.shape({
        title: PropTypes.string
    }),
    resetStilling: PropTypes.func.isRequired,
    getStilling: PropTypes.func.isRequired,
    isFetchingStilling: PropTypes.bool,
    error: PropTypes.shape({
        statusCode: PropTypes.number
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    })
};

const mapStateToProps = (state) => ({
    isFetchingStilling: state.stilling.isFetchingStilling,
    stilling: state.stilling.stilling,
    cachedStilling: state.stilling.cachedStilling,
    error: state.stilling.error
});

const mapDispatchToProps = (dispatch) => ({
    getStilling: (uuid) => dispatch({type: FETCH_STILLING_BEGIN, uuid}),
    resetStilling: () => dispatch({type: RESET_STILLING})
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);

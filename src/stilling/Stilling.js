/* eslint-disable no-underscore-dangle,prefer-destructuring */
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Flatknapp } from 'pam-frontend-knapper';
import BackLink from '../backLink/BackLink';
import getEmployer from '../../server/common/getEmployer';
import getWorkLocation from '../../server/common/getWorkLocation';
import { CONTEXT_PATH } from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import ToggleFavouriteButton from '../favourites/toggleFavoriteButton/ToggleFavouriteButton';
import { parseQueryString } from '../utils';
import AdDetails from './adDetails/AdDetails';
import AdText from './adText/AdText';
import AdTitle from './adTitle/AdTitle';
import ContactPerson from './contactPerson/ContactPerson';
import EmployerDetails from './employerDetails/EmployerDetails';
import EmploymentDetails from './employmentDetails/EmploymentDetails';
import Expired from './expired/Expired';
import HowToApply from './howToApply/HowToApply';
import Loading from './loading/Loading';
import NotFound from './notFound/NotFound';
import HardRequirements from './requirements/HardRequirements';
import PersonalAttributes from './requirements/PersonalAttributes';
import SoftRequirements from './requirements/SoftRequirements';
import './Stilling.less';
import { FETCH_STILLING_BEGIN, RESET_STILLING } from './stillingReducer';
import { useGoogleAnalytics, useScrollToTop } from '../common/hooks';

const Stilling = ({
    cachedStilling,
    error,
    getStilling,
    isFetchingStilling,
    match,
    stilling,
    resetStilling
}) => {
    useGoogleAnalytics(`${CONTEXT_PATH}/stilling`, 'Stilling');
    useScrollToTop();

    useEffect(() => {
        let uuid = match.params.uuid;
        if (!uuid) {
            uuid = parseQueryString(document.location.search).uuid;
            if (uuid) {
                window.history.replaceState({}, '', `${CONTEXT_PATH}/stilling/${uuid}`);
                getStilling(uuid);
            }
        } else {
            getStilling(uuid);
        }
        return () => {
            resetStilling();

            let metaRobots = document.querySelector('meta[name=robots]');
            if (metaRobots) {
                document.querySelector('head').removeChild(metaRobots);
            }
        }
    }, []);

    useEffect(() => {
        if (stilling && stilling._source && stilling._source.title) {
            document.title = stilling._source.title;
        }
    }, [stilling]);

    useEffect(() => {
        const pageNotFound = error && error.statusCode === 404;
        const adIsNotActive = !isFetchingStilling && stilling && stilling._source.status !== 'ACTIVE';
        if (pageNotFound || adIsNotActive) {
            const content = 'noindex';
            let metaRobots = document.querySelector('meta[name=robots]');

            if (!metaRobots) {
                metaRobots = document.createElement('meta');
                metaRobots.setAttribute('name', 'robots');
                metaRobots.setAttribute('content', content);
                document.querySelector('head').appendChild(metaRobots);
            } else {
                metaRobots.setAttribute('content', content);
            }
        }
    }, [error, isFetchingStilling, stilling]);

    const onPrintClick = () => {
        window.print();
    };

    return (
        <React.Fragment>
            <FavouriteAlertStripe />
            {error && error.statusCode === 404 && (
                <Container>
                    <NotFound />
                </Container>
            )}
            {!error && (
                <article className="Stilling">
                    <header className="Stilling__header">
                        <Container>
                            <Row>
                                <div className="Stilling__header__button-row">
                                    <BackLink />
                                    <div className="Stilling__header__favourite">
                                        {isFetchingStilling && cachedStilling && (
                                            <ToggleFavouriteButton uuid={cachedStilling.uuid} />
                                        )}
                                        {!isFetchingStilling && stilling && (
                                            <ToggleFavouriteButton uuid={stilling._id} />
                                        )}
                                        <Flatknapp
                                            mini
                                            className="StillingSubMenu__print"
                                            onClick={onPrintClick}
                                        >
                                            Skriv ut
                                        </Flatknapp>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <Column xs="12" md="8">
                                    {!isFetchingStilling && stilling && stilling._source.status !== 'ACTIVE' && (
                                        <Expired />
                                    )}
                                    {isFetchingStilling && cachedStilling && (
                                        <AdTitle
                                            title={cachedStilling.title}
                                            employer={getEmployer(cachedStilling)}
                                            location={getWorkLocation(
                                                cachedStilling.properties.location,
                                                cachedStilling.locationList
                                            )}
                                        />
                                    )}
                                    {!isFetchingStilling && stilling && (
                                        <AdTitle
                                            title={stilling._source.title}
                                            employer={getEmployer(stilling._source)}
                                            location={getWorkLocation(
                                                stilling._source.properties.location,
                                                stilling._source.locationList
                                            )}
                                        />
                                    )}
                                </Column>
                            </Row>
                        </Container>
                    </header>
                    {(stilling === undefined || isFetchingStilling) && (
                        <Container className="Stilling__main">
                            <Row>
                                <Column xs="12" md="6">
                                    <Loading />
                                </Column>
                                <Column xs="12" md="2" />
                                <Column xs="12" md="4">
                                    <Loading spinner={false} />
                                </Column>
                            </Row>
                        </Container>
                    )}
                    {!isFetchingStilling && stilling && (
                        <Container className="Stilling__main">
                            <Row>
                                <Column xs="12" md="7">
                                    <AdText adText={stilling._source.properties.adtext} />
                                    <HardRequirements stilling={stilling} />
                                    <SoftRequirements stilling={stilling} />
                                    <PersonalAttributes stilling={stilling} />
                                </Column>
                                <Column xs="12" md="5" className="Stilling__main__aside">
                                    <HowToApply
                                        source={stilling._source.source}
                                        properties={stilling._source.properties}
                                    />
                                    <EmploymentDetails stilling={stilling._source} />
                                    <ContactPerson contactList={stilling._source.contactList} />
                                    <EmployerDetails stilling={stilling._source} />
                                    <AdDetails source={stilling._source} />
                                </Column>
                            </Row>
                        </Container>
                    )}
                </article>
            )}
        </React.Fragment>
    );
};

Stilling.defaultProps = {
    stilling: undefined,
    cachedStilling: undefined,
    isFetchingStilling: false,
    error: undefined,
    match: { params: {} }
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
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid }),
    resetStilling: () => dispatch({ type: RESET_STILLING })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);

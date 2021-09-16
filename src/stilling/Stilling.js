/* eslint-disable no-underscore-dangle,prefer-destructuring */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Flatknapp } from '@navikt/arbeidsplassen-knapper';
import getEmployer from '../../server/common/getEmployer';
import getWorkLocation from '../../server/common/getWorkLocation';
import { CONTEXT_PATH } from '../fasitProperties';
import AdDetails from './adDetails/AdDetails';
import AdText from './adText/AdText';
import ContactPerson from './contactPerson/ContactPerson';
import EmployerDetails from './employerDetails/EmployerDetails';
import EmploymentDetails from './employmentDetails/EmploymentDetails';
import Expired from './expired/Expired';
import FinnAd from './finnAd/FinnAd';
import HowToApply from './howToApply/HowToApply';
import HardRequirements from './requirements/HardRequirements';
import PersonalAttributes from './requirements/PersonalAttributes';
import SoftRequirements from './requirements/SoftRequirements';
import SocialShare from './socialShare/SocialShare';
import { useScrollToTop } from '../common/hooks';
import { sendUrlEndring } from '../common/hooks/useTrackPageview';
import { addRobotsNoIndexMetaTag, removeRobotsMetaTag } from '../common/utils/metaRobots';
import logAmplitudeEvent, { logAmplitudePageview } from '../amplitudeTracker';
import { Link } from 'react-router-dom';
import { track } from '../analytics';
import { fetchStilling } from '../api/api';
import DelayedSpinner from '../common/components/DelayedSpinner';
import FavouriteButton from '../favourites/favouritebutton/FavouriteButton';
import './Stilling.less';

function commaSeparate(...strings) {
    const onlyStrings = strings.filter((string) => (
        typeof string === 'string'
    ));
    return onlyStrings.join(', ');
}

const Stilling = ({ match }) => {
    const uuid = match.params.uuid;

    const [state, setState] = useState({
        data: undefined,
        isPending: false,
        error: undefined
    });

    useScrollToTop();

    /**
     * Fetch stillingen
     */
    useEffect(() => {
        let canceled = false;

        setState((prev) => ({
            ...prev,
            isPending: true,
            data: undefined,
            error: undefined
        }));

        fetchStilling(uuid).then(
            (response) => {
                if (!canceled) {
                    setState((prev) => ({
                        ...prev,
                        isPending: false,
                        data: response
                    }));
                }
            }, (error) => {
                if (!canceled) {
                    setState((prev) => ({
                        ...prev,
                        isPending: false,
                        error: error
                    }));
                }
            }
        );

        return () => {
            canceled = true;
        }
    }, [uuid]);


    /**
     * Oppdater title i nettleseren
     */
    useEffect(() => {
        if (state.data && state.data._source && state.data._source.title) {
            document.title = state.data._source.title;
        }
    }, [state.data]);


    /**
     * Track analytic events
     */
    useEffect(() => {
        if (state.data && state.data._source && state.data._id && state.data._source.title) {
            try {
                ga('set', 'page', `${CONTEXT_PATH}/stilling/${state.data._id}`);
                ga('set', 'title', state.data._source.title);
                ga('send', 'pageview');
                logAmplitudePageview();
            } catch (e) {
                // ignore
            }

            try {
                logAmplitudeEvent('Stilling visning', {
                    title: state.data._source.title || "N/A",
                    id: state.data._id,
                    businessName: state.data._source.businessName || "N/A",
                    country: state.data._source.employer.location.country || "N/A",
                    county: state.data._source.employer.location.county || "N/A",
                    city: state.data._source.employer.location.city || "N/A",
                    employer: state.data._source.employer.name || "N/A",
                    expires: state.data._source.expires || "N/A",
                    published: state.data._source.published || "N/A"
                })
            } catch (e) {
                // ignore
            }

            sendUrlEndring({ page: `${CONTEXT_PATH}/stilling`, source: state.data._source.source });
        }
    }, [state.data]);

    /**
     * Unngå at inaktive stillinger indexeres av søkeroboter, f.eks google.
     */
    useEffect(() => {
        const pageNotFound = state.error && state.error.statusCode === 404;
        const adIsNotActive = !state.isPending && state.data && state.data._source.status !== 'ACTIVE';
        if (pageNotFound || adIsNotActive) {
            addRobotsNoIndexMetaTag()
        }
        return () => {
            removeRobotsMetaTag();
        }
    }, [state.error, state.isPending, state.data]);


    const onPrintClick = () => {
        track('send', 'event', 'ux-test-juni-2021', 'Klikket Print-knappen inne i en annonse');
        window.print();
    };

    const isFinn = state.data && state.data._source && state.data._source.source && state.data._source.source.toLowerCase() === 'finn';

    return (
        <div className="Stilling">
            <a id="main-content" tabIndex="-1" />

            {state.error ? (
                <React.Fragment>
                    {state.error.statusCode === 404 ? (
                        <React.Fragment>
                            <h1 className="Stilling__h1">Ikke funnet</h1>
                            <p>Stillingsannonsen kan være utløpt eller blitt fjernet av arbeidsgiver.</p>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <h1 className="Stilling__h1">Feil</h1>
                            <p>Det har oppstått en feil. Forsøk å laste siden på nytt</p>
                        </React.Fragment>
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {state.data === undefined || state.isPending ? (
                        <div className="Stilling__spinner">
                            <DelayedSpinner />
                        </div>
                    ) : (
                        <div className="Stilling__flex">
                            <div className="Stilling__left">
                                {state.data._source.status !== 'ACTIVE' && (
                                    <Expired />
                                )}
                                <h1 className="Stilling__h1">
                                    {state.data._source.title}
                                </h1>
                                <p className="Stilling__employer-and-location">
                                    {commaSeparate(getEmployer(state.data._source), getWorkLocation(
                                        state.data._source.properties.location,
                                        state.data._source.locationList
                                    ))}
                                </p>

                                {isFinn ? (
                                    <FinnAd stilling={state.data}/>
                                ) : (
                                    <React.Fragment>
                                        <AdText adText={state.data._source.properties.adtext}/>
                                        <HardRequirements stilling={state.data}/>
                                        <SoftRequirements stilling={state.data}/>
                                        <PersonalAttributes stilling={state.data}/>
                                        <SocialShare title={state.data._source.title}/>
                                    </React.Fragment>
                                )}

                                <div className="Rapport__link">
                                    <Link
                                        className={"link"}
                                        to={`${CONTEXT_PATH}/rapporter-annonse?uuid=${state.data._id}`}
                                        aria-label="Rapporter annonse"
                                    >
                                        Rapporter annonse
                                    </Link>
                                </div>
                            </div>
                            <div className="Stilling__right">
                                <div className="Stilling__buttons">
                                    <FavouriteButton ad={state.data._source}/>
                                    <Flatknapp
                                        mini
                                        className="Stilling__print"
                                        onClick={onPrintClick}
                                    >
                                        Skriv ut
                                    </Flatknapp>
                                </div>
                                {!isFinn && (
                                    <React.Fragment>
                                        <HowToApply
                                            source={state.data._source.source}
                                            properties={state.data._source.properties}
                                        />
                                        <EmploymentDetails stilling={state.data._source}/>
                                        <ContactPerson contactList={state.data._source.contactList}/>
                                        <EmployerDetails stilling={state.data._source}/>
                                        <AdDetails source={state.data._source}/>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

Stilling.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    }).isRequired
};

export default Stilling;


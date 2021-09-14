/* eslint-disable no-underscore-dangle,prefer-destructuring */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {Flatknapp} from '@navikt/arbeidsplassen-knapper';
import {Column, Container, Row} from 'nav-frontend-grid';
import getEmployer from '../../server/common/getEmployer';
import getWorkLocation from '../../server/common/getWorkLocation';
import {CONTEXT_PATH} from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import ToggleFavouriteButton from '../favourites/toggleFavoriteButton/ToggleFavouriteButton';
import AdDetails from './adDetails/AdDetails';
import AdText from './adText/AdText';
import ContactPerson from './contactPerson/ContactPerson';
import EmployerDetails from './employerDetails/EmployerDetails';
import EmploymentDetails from './employmentDetails/EmploymentDetails';
import Expired from './expired/Expired';
import FinnAd from './finnAd/FinnAd';
import HowToApply from './howToApply/HowToApply';
import NotFound from './notFound/NotFound';
import HardRequirements from './requirements/HardRequirements';
import PersonalAttributes from './requirements/PersonalAttributes';
import SoftRequirements from './requirements/SoftRequirements';
import SocialShare from './socialShare/SocialShare';
import './Stilling.less';
import {useScrollToTop} from '../common/hooks';
import {sendUrlEndring} from '../common/hooks/useTrackPageview';
import {addRobotsNoIndexMetaTag, removeRobotsMetaTag} from '../common/utils/metaRobots';
import logAmplitudeEvent, {logAmplitudePageview} from '../amplitudeTracker';
import {Link} from 'react-router-dom';
import { track } from '../analytics';
import { fetchStilling } from '../api/api';
import DelayedSpinner from '../common/components/DelayedSpinner';

function commaSeparate(...strings) {
    const onlyStrings = strings.filter((string) => (
        typeof string === 'string'
    ));
    return onlyStrings.join(', ');
}

const Stilling = ({ match }) => {
    const uuid = match.params.uuid;
    const [response, setResponse] = useState({data: undefined, isPending: true, error: undefined });

    useScrollToTop();

    /**
     * Fetch stillingen
     */
    useEffect(() => {
        let canceled = false;

        setResponse({
            isPending: true,
            data: undefined,
            error: undefined
        });

        fetchStilling(uuid).then(
            (data) => {
                if (!canceled) {
                    setResponse({
                        isPending: false,
                        data,
                        error: undefined
                    });
                }
            },  (error) => {
                if (!canceled) {
                    setResponse({
                        isPending: false,
                        data: undefined,
                        error
                    });
                }
            }
        );

        return () => {
           canceled = true;
        }
    }, [uuid]);

     /**
     * Track analytic events
     */
    useEffect(() => {
        if (response.data && response.data._source && response.data._id && response.data._source.title) {
            document.title = response.data._source.title;

            try {
                ga('set', 'page', `${CONTEXT_PATH}/stilling/${response.data._id}`);
                ga('set', 'title', response.data._source.title);
                ga('send', 'pageview');
                logAmplitudePageview();
            } catch (e) {
                // ignore
            }

            try {
                logAmplitudeEvent('Stilling visning', {
                    title: response.data._source.title || "N/A",
                    id: response.data._id,
                    businessName: response.data._source.businessName || "N/A",
                    country: response.data._source.employer.location.country || "N/A",
                    county: response.data._source.employer.location.county || "N/A",
                    city: response.data._source.employer.location.city || "N/A",
                    employer: response.data._source.employer.name || "N/A",
                    expires: response.data._source.expires || "N/A",
                    published: response.data._source.published || "N/A"
                })
            } catch (e) {
                // ignore
            }

            sendUrlEndring({page: `${CONTEXT_PATH}/stilling`, source: response.data._source.source});
        }
    }, [response.data]);

    /**
     * Unngå at inaktive stillinger indexeres av søkeroboter, f.eks google.
     */
    useEffect(() => {
        const pageNotFound = response.error && response.error.statusCode === 404;
        const adIsNotActive = !response.isPending && response.data && response.data._source.status !== 'ACTIVE';
        if (pageNotFound || adIsNotActive) {
            addRobotsNoIndexMetaTag()
        }
        return () => {
            removeRobotsMetaTag();
        }
    }, [response.error, response.isPending, response.data]);


    const onPrintClick = () => {
        track('send', 'event', 'ux-test-juni-2021', 'Klikket Print-knappen inne i en annonse');
        window.print();
    };

    const isFinn = response.data && response.data._source && response.data._source.source && response.data._source.source.toLowerCase() === 'finn';

    return (
        <div className="Stilling">
            <a id="main-content" tabIndex="-1" />
            <FavouriteAlertStripe/>

            {response.isPending ? (
                <div className="Stilling__spinner">
                    <DelayedSpinner />
                </div>
            ) : (
              <React.Fragment>
                  {response.error ? (
                      <React.Fragment>
                          {response.error.statusCode === 404 ? (
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
                      <div className="Stilling__flex">
                          <div className="Stilling__left">
                              {response.data._source.status !== 'ACTIVE' && (
                                  <Expired />
                              )}
                              <h1 className="Stilling__h1">
                                  {response.data._source.title}
                              </h1>
                              <p className="Stilling__employer-and-location">
                                  {commaSeparate(getEmployer(response.data._source), getWorkLocation(
                                      response.data._source.properties.location,
                                      response.data._source.locationList
                                  ))}
                              </p>

                              {isFinn ? (
                                  <FinnAd stilling={response.data}/>
                              ) : (
                                  <React.Fragment>
                                      <AdText adText={response.data._source.properties.adtext}/>
                                      <HardRequirements stilling={response.data}/>
                                      <SoftRequirements stilling={response.data}/>
                                      <PersonalAttributes stilling={response.data}/>
                                      <SocialShare title={response.data._source.title}/>
                                  </React.Fragment>
                              )}

                              <div className="Rapport__link">
                                  <Link
                                      className={"link"}
                                      to={`${CONTEXT_PATH}/rapporter-annonse?uuid=${response.data._id}`}
                                      aria-label="Rapporter annonse"
                                  >
                                      Rapporter annonse
                                  </Link>
                              </div>
                          </div>
                          <div className="Stilling__right">
                              <div className="Stilling__buttons">
                                  <ToggleFavouriteButton uuid={response.data._id}/>
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
                                          source={response.data._source.source}
                                          properties={response.data._source.properties}
                                      />
                                      <EmploymentDetails stilling={response.data._source}/>
                                      <ContactPerson contactList={response.data._source.contactList}/>
                                      <EmployerDetails stilling={response.data._source}/>
                                      <AdDetails source={response.data._source}/>
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

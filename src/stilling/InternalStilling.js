/* eslint-disable no-underscore-dangle,prefer-destructuring */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Flatknapp } from '@navikt/arbeidsplassen-knapper';
import getEmployer from '../../server/common/getEmployer';
import getWorkLocation from '../../server/common/getWorkLocation';
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
import './Stilling.less';
import { useScrollToTop } from '../common/hooks';
import { addRobotsNoIndexMetaTag, removeRobotsMetaTag } from '../common/utils/metaRobots';
import { fetchInternStilling } from '../api/api';
import DelayedSpinner from '../common/components/DelayedSpinner';

function commaSeparate(...strings) {
    const onlyStrings = strings.filter((string) => (
        typeof string === 'string'
    ));
    return onlyStrings.join(', ');
}

const InternalStilling = ({ match }) => {
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

        fetchInternStilling(uuid).then(
            (response) => {
                if (!canceled) {
                    setState((prev) => ({
                        ...prev,
                        isPending: false,
                        data: response
                    }));
                }
            },  (error) => {
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
     * Unngå at interne stillinger indexeres av søkeroboter, f.eks google.
     */
    useEffect(() => {
        addRobotsNoIndexMetaTag();
        return () => {
            removeRobotsMetaTag();
        }
    }, []);


    const onPrintClick = () => {
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
                                    </React.Fragment>
                                )}
                            </div>
                            <div className="Stilling__right">
                                <div className="Stilling__buttons">
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

InternalStilling.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            uuid: PropTypes.string
        })
    }).isRequired
};

export default InternalStilling;


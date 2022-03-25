/* eslint-disable no-underscore-dangle,prefer-destructuring */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Column, Container, Row } from 'nav-frontend-grid';
import { CONTEXT_PATH } from '../fasitProperties';
import { parseQueryString, stringifyQueryObject } from '../utils';
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
import './Stilling.less';
import { useScrollToTop } from '../common/hooks';
import { FETCH_INTERAL_STILLING_BEGIN, RESET_INTERAL_STILLING } from './internalStillingReducer';
import { addRobotsNoIndexMetaTag, removeRobotsMetaTag } from '../common/utils/metaRobots';
import Summary from "./summary/Summary";
import PrintButton from "../common/components/PrintButton";

const InternalStilling = ({ error, getInternalStilling, isFetchingStilling, match, stilling, resetStilling }) => {

    useScrollToTop();

    useEffect(() => {
        let uuidParam = match.params.uuid;
        if (!uuidParam) {
            // Om man logget inn mens man var inne på en stillingsannonse, så vil loginservice
            // redirecte til en url med dette url-formatet: '/stillinger/intern?uuid=12345'.
            // Redirecter derfor til riktig url-format: '/stillinger/intern/:uuid'
            // @see src/authentication/authenticationReducer.js
            const {uuid, ...otherQueryParams } = parseQueryString(document.location.search);

            if (uuid && typeof uuid === "string") {
                window.history.replaceState({}, '', `${CONTEXT_PATH}/intern/${uuid}${stringifyQueryObject(otherQueryParams)}`);
                getInternalStilling(uuid);
            }
        } else {
            getInternalStilling(uuidParam);
        }
        return () => {
            resetStilling();
        }
    }, []);

    useEffect(() => {
        addRobotsNoIndexMetaTag();
        return () => {
            removeRobotsMetaTag();
        }
    }, []);

    useEffect(() => {
        if (stilling && stilling._source && stilling._source.title) {
            document.title = stilling._source.title;
        }
    }, [stilling]);

    const onPrintClick = () => {
        window.print();
    };

    const isFinn = stilling && stilling._source && stilling._source.source && stilling._source.source.toLowerCase() === 'finn';

    return (
        <div className="Stilling">

            {error && error.statusCode === 404 && (
                <NotFound />
            )}

            {!error && (
                <Container>
                    <Row className="Stilling__row">
                        <Column xs="12" md="7" lg="8">
                            <div className="Stilling__left">
                                {!isFetchingStilling && stilling && stilling._source.status !== 'ACTIVE' && (
                                    <Expired />
                                )}
                                {!isFetchingStilling && stilling && (
                                    <h1 className="Stilling__h1">
                                        {stilling._source.title}
                                    </h1>
                                )}
                                {(stilling === undefined || isFetchingStilling) && (
                                    <Loading />
                                )}
                                {!isFetchingStilling && stilling && isFinn && (
                                    <FinnAd stilling={stilling} />
                                )}
                                {!isFetchingStilling && stilling && !isFinn && (
                                    <React.Fragment>
                                        <Summary stilling={stilling._source} />
                                        <AdText adText={stilling._source.properties.adtext} />
                                        <HardRequirements stilling={stilling} />
                                        <SoftRequirements stilling={stilling} />
                                        <PersonalAttributes stilling={stilling} />
                                        <EmployerDetails stilling={stilling._source} />
                                    </React.Fragment>
                                )}
                            </div>
                        </Column>
                        <Column xs="12" md="5" lg="4">
                            <div className="Stilling__buttons">
                                <PrintButton onClick={onPrintClick} />
                            </div>
                        </Column>
                        <Column xs="12" md="5" lg="4">
                            {(stilling === undefined || isFetchingStilling) && (
                                <Loading spinner={false} />
                            )}
                            {!isFetchingStilling && stilling && !isFinn && (
                                <React.Fragment>
                                    <HowToApply
                                        stilling={stilling}
                                    />
                                    <EmploymentDetails stilling={stilling._source} />
                                    <ContactPerson contactList={stilling._source.contactList} />
                                </React.Fragment>
                            )}
                            {!isFetchingStilling && stilling && (
                                <AdDetails id={stilling._id} source={stilling._source} />
                            )}
                        </Column>
                    </Row>
                </Container>
            )}
        </div>
    );
};

InternalStilling.defaultProps = {
    stilling: undefined,
    isFetchingStilling: false,
    error: undefined,
    match: { params: {} }
};

InternalStilling.propTypes = {
    stilling: PropTypes.shape({
        _source: PropTypes.shape({
            status: PropTypes.string,
            title: PropTypes.string,
            properties: PropTypes.shape({
                adtext: PropTypes.string
            })
        })
    }),
    resetStilling: PropTypes.func.isRequired,
    getInternalStilling: PropTypes.func.isRequired,
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
    isFetchingStilling: state.internalStilling.isFetchingStilling,
    stilling: state.internalStilling.stilling,
    error: state.internalStilling.error
});

const mapDispatchToProps = (dispatch) => ({
    getInternalStilling: (uuid) => dispatch({ type: FETCH_INTERAL_STILLING_BEGIN, uuid }),
    resetStilling: () => dispatch({ type: RESET_INTERAL_STILLING })
});

export default connect(mapStateToProps, mapDispatchToProps)(InternalStilling);

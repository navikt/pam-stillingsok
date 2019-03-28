/* eslint-disable no-underscore-dangle */
import Chevron from 'nav-frontend-chevron';
import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlatButton } from '../common/button';
import getEmployer from '../common/getEmployer';
import getWorkLocation from '../common/getWorkLocation';
import { setMetaRobotsTag, removeMetaRobotsTag } from '../common/metaRobots';
import { CONTEXT_PATH } from '../fasitProperties';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import ToggleFavouriteButton from '../favourites/toggleFavoriteButton/ToggleFavouriteButton';
import { urlFromSessionStorageOrIndex } from '../urlReducer';
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
import { FETCH_STILLING_BEGIN } from './stillingReducer';

class Stilling extends React.Component {
    constructor(props) {
        super(props);
        this.hasSetTitle = false;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.getStilling(this.props.match.params.uuid);
        ga('set', 'page', `${CONTEXT_PATH}/stilling`);
        ga('set', 'title', 'Stilling');
        ga('send', 'pageview');
    }

    componentWillUnmount() {
        removeMetaRobotsTag();
    }

    componentDidUpdate() {
        if (!this.hasSetTitle
            && this.props.stilling
            && this.props.stilling._source
            && this.props.stilling._source.title) {
            document.title = this.props.stilling._source.title;
            this.hasSetTitle = true;
        }

        if ((this.props.error && this.props.error.statusCode === 404)
            ||
            (!this.props.isFetchingStilling
             && this.props.stilling && this.props.stilling._source.status !== 'ACTIVE')) {

            setMetaRobotsTag('noindex');
        }
    }

    onPrintClick = () => {
        window.print();
    };

    render() {
        const {
            stilling, cachedStilling, isFetchingStilling, error
        } = this.props;

        return (
            <div>
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
                                        <Link
                                            to={`${urlFromSessionStorageOrIndex()}`}
                                            className="Stilling__header__button-row__back PageHeader__back link no-print"
                                        >
                                            <Chevron type="venstre" className="PageHeader__back__chevron" />
                                            <span className="PageHeader__back__text">
                                            Til stillingssøk
                                            </span>
                                        </Link>
                                        <div className="Stilling__header__favourite">
                                            {isFetchingStilling && cachedStilling && (
                                                <ToggleFavouriteButton uuid={cachedStilling.uuid} />
                                            )}
                                            {!isFetchingStilling && stilling && (
                                                <ToggleFavouriteButton uuid={stilling._id} />
                                            )}
                                            <FlatButton
                                                mini
                                                className="StillingSubMenu__print"
                                                onClick={this.onPrintClick}
                                            >
                                            Skriv ut
                                            </FlatButton>
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
                        {isFetchingStilling && (
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
            </div>
        );
    }
}

Stilling.defaultProps = {
    stilling: undefined,
    cachedStilling: undefined,
    isFetchingStilling: false
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
    getStilling: PropTypes.func.isRequired,
    isFetchingStilling: PropTypes.bool,
    error: PropTypes.shape({
        statusCode: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    isFetchingStilling: state.stilling.isFetchingStilling,
    stilling: state.stilling.stilling,
    cachedStilling: state.stilling.cachedStilling,
    error: state.stilling.error
});

const mapDispatchToProps = (dispatch) => ({
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);

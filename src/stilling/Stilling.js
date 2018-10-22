/* eslint-disable no-underscore-dangle */
import Chevron from 'nav-frontend-chevron';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Disclaimer from '../discalimer/Disclaimer';
import FavouriteAlertStripe from '../favourites/alertstripe/FavouriteAlertStripe';
import ToggleFavouriteButton from '../favourites/toggleFavoriteButton/ToggleFavouriteButton';
import FavouriteError from '../favourites/error/FavouriteError';
import { FETCH_FAVOURITES } from '../favourites/favouritesReducer';
import SearchError from '../search/error/SearchError';
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
import NotLoggedIn from '../authorization/NotLoggedIn';

class Stilling extends React.Component {
    constructor(props) {
        super(props);
        this.hasSetTitle = false;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.getStilling(this.props.match.params.uuid);
    }

    componentDidUpdate() {
        if (!this.hasSetTitle
            && this.props.stilling
            && this.props.stilling._source
            && this.props.stilling._source.title) {
            document.title = this.props.stilling._source.title;
            this.hasSetTitle = true;
        }
    }

    onPrintClick = () => {
        window.print();
    };

    render() {
        const {
            stilling, cachedStilling, isFetchingStilling, error, favourites
        } = this.props;

        return (
            <div>
                <Disclaimer />
                <FavouriteAlertStripe />
                <FavouriteError />
                <NotLoggedIn />

                {error && error.statusCode === 404 ? (
                    <Container>
                        <NotFound />
                    </Container>
                ) : error && (
                    <Container>
                        <SearchError />
                    </Container>
                )}


                <article className="Stilling">
                    <header className="Stilling__header">
                        <Container>
                            <Row>
                                <Column xs="12">
                                    <div className="blokk-s">
                                        <Link
                                            to="/"
                                            className="PageHeader__back typo-normal lenke no-print"
                                        >
                                            <Chevron type="venstre" className="PageHeader__back__chevron" />
                                            <span className="PageHeader__back__text">
                                                    Til stillingsøk
                                            </span>
                                        </Link>
                                    </div>
                                </Column>
                                <Column xs="12" md="8">
                                    {!isFetchingStilling && stilling && stilling._source.status === 'INACTIVE' && (
                                        <Expired />
                                    )}
                                    {isFetchingStilling && cachedStilling && (
                                        <AdTitle
                                            title={cachedStilling.title}
                                            employer={cachedStilling.properties.employer}
                                            location={cachedStilling.properties.location}
                                        />
                                    )}
                                    {!isFetchingStilling && stilling && (
                                        <AdTitle
                                            title={stilling._source.title}
                                            employer={stilling._source.properties.employer}
                                            location={stilling._source.properties.location}
                                        />
                                    )}
                                </Column>
                                <Column xs="12" md="4">
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
                                            onClick={this.onPrintClick}
                                        >
                                                Skriv ut
                                        </Flatknapp>
                                    </div>
                                </Column>
                            </Row>
                        </Container>
                    </header>
                    {isFetchingStilling && (
                        <Container className="Stilling__main">
                            <Row>
                                <Column xs="12" md="8">
                                    <Loading />
                                </Column>
                                <Column xs="12" md="4">
                                    <Loading spinner={false} />
                                </Column>
                            </Row>
                        </Container>
                    )}
                    {!isFetchingStilling && stilling && (
                        <Container className="Stilling__main">
                            <Row>
                                <Column xs="12" md="8">
                                    <AdText adText={stilling._source.properties.adtext} />
                                    <HardRequirements stilling={stilling} />
                                    <SoftRequirements stilling={stilling} />
                                    <PersonalAttributes stilling={stilling} />
                                </Column>
                                <Column xs="12" md="4">
                                    <HowToApply
                                        source={stilling._source.source}
                                        properties={stilling._source.properties}
                                    />
                                    <EmploymentDetails properties={stilling._source.properties} />
                                    <ContactPerson contactList={stilling._source.contactList} />
                                    <EmployerDetails properties={stilling._source.properties} />
                                    <AdDetails source={stilling._source} />
                                </Column>
                            </Row>
                        </Container>
                    )}
                </article>
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
    favourites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    isFetchingStilling: state.stilling.isFetchingStilling,
    stilling: state.stilling.stilling,
    cachedStilling: state.stilling.cachedStilling,
    error: state.stilling.error,
    favourites: state.favourites.favourites
});

const mapDispatchToProps = (dispatch) => ({
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);

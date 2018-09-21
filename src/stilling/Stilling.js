/* eslint-disable no-underscore-dangle */
import { Column, Container, Row } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Disclaimer from '../discalimer/Disclaimer';
import FavouriteAlertStripe from '../favourites/FavouriteAlertStripe';
import FavouriteButton from '../favourites/FavouriteButton';
import FavouriteError from '../favourites/FavouriteError';
import { FETCH_FAVOURITES } from '../favourites/favouritesReducer';
import SearchError from '../search/error/SearchError';
import AdDetails from './adDetails/AdDetails';
import AdText from './adText/AdText';
import AdTitle from './adTitle/AdTitle';
import BackToSearch from './backToSearch/BackToSearch';
import ContactPerson from './contactPerson/ContactPerson';
import EmployerDetails from './employerDetails/EmployerDetails';
import EmploymentDetails from './employmentDetails/EmploymentDetails';
import Expired from './expired/Expired';
import HowToApply from './howToApply/HowToApply';
import Skeleton from './loading/Skeleton';
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
        this.props.fetchFavourites();
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

        const isFavourite = stilling && favourites && favourites.find((favourite) => favourite.uuid === stilling._id);

        return (
            <div>
                <Disclaimer />
                <FavouriteAlertStripe />
                <FavouriteError />
                <div className="StillingSubMenu no-print">
                    <Container>
                        <Row>
                            <Column xs="6">
                                <BackToSearch />
                            </Column>
                            <Column xs="6">
                                <div className="StillingSubMenu__right">
                                    <Flatknapp className="StillingSubMenu__print" onClick={this.onPrintClick}>
                                        Skriv ut
                                    </Flatknapp>
                                </div>
                            </Column>
                        </Row>
                    </Container>
                </div>

                {error && error.statusCode === 404 ? (
                    <Container>
                        <NotFound />
                    </Container>
                ) : error && (
                    <Container>
                        <SearchError />
                    </Container>
                )}

                {isFetchingStilling && (
                    <Skeleton stilling={cachedStilling} />
                )}

                {!isFetchingStilling && stilling && (
                    <article className="Stilling">
                        <header className="Stilling__header">
                            <Container>
                                <Row>
                                    <Column xs="12">
                                        <div className="Stilling__header__favourite">
                                            {isFavourite ? (
                                                <div className="Stilling__header__favourite__flex">
                                                    <FavouriteButton uuid={stilling._id} />
                                                    <Normaltekst>
                                                        <b>Lagret i</b> <Link to="/favoritter" className="lenke">favoritter</Link>
                                                    </Normaltekst>
                                                </div>
                                            ) : (
                                                <FavouriteButton uuid={stilling._id} showLabel />
                                            )}
                                        </div>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column xs="12" md="8">
                                        {stilling._source.status !== 'ACTIVE' && (
                                            <Expired />
                                        )}
                                        <AdTitle
                                            title={stilling._source.title}
                                            employer={stilling._source.properties.employer}
                                            location={stilling._source.properties.location}
                                        />
                                    </Column>
                                    <Column xs="12" md="4" />
                                </Row>
                            </Container>
                        </header>
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
                                    <ContactPerson properties={stilling._source.properties} />
                                    <EmployerDetails properties={stilling._source.properties} />
                                    <AdDetails source={stilling._source} />
                                </Column>
                            </Row>
                        </Container>
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
    fetchFavourites: PropTypes.func.isRequired,
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
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid }),
    fetchFavourites: () => dispatch({ type: FETCH_FAVOURITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);

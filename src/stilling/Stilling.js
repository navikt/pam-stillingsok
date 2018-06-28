/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import AdTitle from './adTitle/AdTitle';
import AdText from './adText/AdText';
import PersonalAttributes from './requirements/PersonalAttributes';
import SoftRequirements from './requirements/SoftRequirements';
import HardRequirements from './requirements/HardRequirements';
import HowToApply from './howToApply/HowToApply';
import ContactPerson from './contactPerson/ContactPerson';
import EmployerDetails from './employerDetails/EmployerDetails';
import EmploymentDetails from './employmentDetails/EmploymentDetails';
import AdDetails from './adDetails/AdDetails';
import NotFound from './notFound/NotFound';
import SearchError from '../search/error/SearchError';
import Expired from './expired/Expired';
import BackToSearch from './backToSearch/BackToSearch';
import { RESTORE_STATE_FROM_URL } from '../search/searchReducer';
import Disclaimer from '../discalimer/Disclaimer';
import Skeleton from './loading/Skeleton';
import {
    FETCH_STILLING_BEGIN
} from './stillingReducer';
import './Stilling.less';

class Stilling extends React.Component {
    constructor(props) {
        super(props);
        this.hasSetTitle = false;
        this.props.restoreStateFromUrl();
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
            stilling, cachedStilling, isFetchingStilling, error
        } = this.props;
        return (
            <div>
                <Disclaimer />

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
    restoreStateFromUrl: PropTypes.func.isRequired,
    getStilling: PropTypes.func.isRequired,
    isFetchingStilling: PropTypes.bool
};

const mapStateToProps = (state) => ({
    isFetchingStilling: state.stilling.isFetchingStilling,
    stilling: state.stilling.stilling,
    cachedStilling: state.stilling.cachedStilling,
    error: state.stilling.error
});

const mapDispatchToProps = (dispatch) => ({
    restoreStateFromUrl: () => dispatch({ type: RESTORE_STATE_FROM_URL }),
    getStilling: (uuid) => dispatch({ type: FETCH_STILLING_BEGIN, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Stilling);

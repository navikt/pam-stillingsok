import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

import StillingListKart from './stilling/StillingListKart';
import StillingListPagineringKart from './stilling/StillingListPagineringKart';
import { toUrl } from '../sokekriterier/SearchCriteria';
import dataService from '../DataService';

class KartPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: this.props.startSide - 1,
            gjeldendeStilling: undefined
        };
    }

    componentDidMount() {
        this.getStillinger(this.props.searchCriteria);
    }

    onChangePage = (page) => {
        this.setState({
            page,
            gjeldendeStilling: this.state.stillinger[page]
        });
    };

    getStillinger = (criteria) => {
        if (this.props.prepopulerteStillinger.length) {
            this.setState({
                stillinger: this.props.prepopulerteStillinger,
                count: this.props.prepopulerteStillinger.count,
                isFetching: false,
                error: undefined,
                gjeldendeStilling: this.props.prepopulerteStillinger[this.state.page]
            });
            return;
        }
        const urlParams = toUrl({
            ...criteria,
            itemsPerPage: '9999'
        });

        this.setState({
            isFetching: true
        });

        dataService.getData(`/sok/rest/stillingsok/stillinger${urlParams}`).then(
            (response) => {
                if (response.unknown) {
                    response.stillinger = [];
                }

                this.setState({
                    stillinger: response.stillinger,
                    count: response.count,
                    isFetching: false,
                    error: undefined,
                    gjeldendeStilling: response.stillinger[this.state.page]
                });
            },
            (error) => {
                this.setState({
                    error,
                    isFetching: false
                });
            }
        );
    };

    render() {
        if (!this.state.gjeldendeStilling) {
            return (
                <div className="text-center">
                    {this.state.isFetching ? (// eslint-disable-line no-nested-ternary
                        <div>
                            <NavFrontendSpinner />
                            <Element>Laster</Element>
                        </div>
                    ) : this.state.error ? (
                        <AlertStripeAdvarsel>Henting av data feilet</AlertStripeAdvarsel>
                    ) : (
                        <div />
                    )}
                </div>
            );
        }

        const antall = this.state.stillinger.length;

        return (
            <div>
                <StillingListKart
                    stillinger={[this.state.gjeldendeStilling]}
                    search={this.props.location.search}
                    closePopup={this.props.closePopup}
                />

                {antall > 1 && (
                    <StillingListPagineringKart
                        page={this.state.page}
                        count={antall}
                        itemsPerPage={1}
                        changePage={this.onChangePage}
                        urlParams={toUrl(this.props.searchCriteria)}
                    />
                )}
            </div>
        );
    }
}

KartPopup.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string
    }).isRequired,
    searchCriteria: PropTypes.shape({
        search: PropTypes.string
    }).isRequired,
    closePopup: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    prepopulerteStillinger: PropTypes.array.isRequired,
    startSide: PropTypes.number.isRequired
};

export default withRouter(KartPopup);

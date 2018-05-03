import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Kart from './kart/Kart';

const NotFound = () => (
    <div className="text-center">
        <h1>Fant ikke siden du ser etter</h1>
    </div>
);
// eslint-disable-next-line react/prefer-stateless-function
export default class KartApp extends Component {
    render() {
        return (
            <main className="blokk">
                {this.props.children}

                <Switch>
                    <Route path="/sok/kart" component={Kart} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </main>
        );
    }
}

KartApp.defaultProps = {
    children: undefined
};

KartApp.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

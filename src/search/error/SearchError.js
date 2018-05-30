import React from 'react';
import { connect } from 'react-redux';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';

function refreshPage() {
    window.location.reload();
}

export function SearchError({ error }) {
    return (
        <AlertStripeAdvarsel type="advarsel" className="blokk-xs">
            <div className="blokk-xs">
                <strong>Det oppstod en feil.</strong> Forsøk å laste siden på nytt.
            </div>
            <Hovedknapp mini onClick={refreshPage}>Last siden på nytt</Hovedknapp>
        </AlertStripeAdvarsel>
    );
}

const mapStateToProps = (state) => ({
    error: state.search.error
});

export default connect(mapStateToProps)(SearchError);

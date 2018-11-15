import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { HIDE_DISCLAIMER } from './disclaimerReducer';
import './Disclaimer.less';

function Disclaimer({ shouldShow, hideDisclaimer }) {
    if (shouldShow) {
        return (
            <div className="DisclaimerWrapper no-print">
                <div className="container">
                    <div role="alert" className="Disclaimer typo-normal">
                        <Element className="blokk-xxs">Tidlig versjon av nytt stillingssøk</Element>
                        <Normaltekst className="blokk-xxs">
                            Vi utvikler nytt stillingssøk, og ønsker at du skal prøve det underveis.
                            Midlertidige feil i tjenesten på grunn av teknisk arbeid kan forekomme.
                            <br/>
                            Akkurat nå jobber vi for at du skal kunne lagre søk og annonser.
                            Inntil videre kan du bare gjøre dette i dagens stillingssøk.
                        </Normaltekst>
                        <Normaltekst className="blokk-xxs">
                            <a href="https://surveys.hotjar.com/s?siteId=148751&surveyId=123859" className="lenke">
                                Gi oss din tilbakemelding på det nye stillingssøket
                            </a>
                        </Normaltekst>
                        <Normaltekst className="blokk-xs">
                            <a href="https://tjenester.nav.no/stillinger/" className="lenke">
                                Gå tilbake til dagens stillingssøk
                            </a>
                        </Normaltekst>
                        <Knapp mini onClick={hideDisclaimer}>Skjul</Knapp>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="DisclaimerWrapper no-print">
                <div className="container">
                    <div role="alert" className="Feedback typo-normal">
                        <Normaltekst className="blokk-xxs">
                            <a href="https://surveys.hotjar.com/s?siteId=148751&surveyId=123859" className="lenke">
                                Gi oss din tilbakemelding på det nye stillingssøket
                            </a>
                        </Normaltekst>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

Disclaimer.propTypes = {
    shouldShow: PropTypes.bool.isRequired,
    hideDisclaimer: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    shouldShow: state.disclaimer.shouldShow
});

const mapDispatchToProps = (dispatch) => ({
    hideDisclaimer: () => dispatch({ type: HIDE_DISCLAIMER })
});

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer);

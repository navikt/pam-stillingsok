import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Lukknapp from 'nav-frontend-lukknapp';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { HIDE_DISCLAIMER } from './disclaimerReducer';
import './Disclaimer.less';

function Disclaimer({ shouldShow, hideDisclaimer }) {
    if (shouldShow) {
        return (
            <div role="alert" className="Disclaimer typo-normal">
                <Element className="blokk-xxs">Tidlig versjon av nytt stillingssøk</Element>
                <Normaltekst>
                    Vi utvikler et nytt stillingsøk, og vil at du skal få prøve
                    det underveis.
                </Normaltekst>
                <Normaltekst className="blokk-xxs">
                    Stillingsannonsene er de samme som i dagens stillingssøk.
                </Normaltekst>
                <Normaltekst>
                    <a href="https://tjenester.nav.no/stillinger/" className="lenke">
                        Gå tilbake til dagens stillingssøk
                    </a>
                </Normaltekst>
                <Lukknapp className="Disclaimer__close" onClick={hideDisclaimer} aria-label="Skjul">Skjul</Lukknapp>
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

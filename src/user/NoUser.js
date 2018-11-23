import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SHOW_TERMS_OF_USE_MODAL } from './userReducer';
import './NoUser.less';

class NoUser extends React.Component {
    onCreateUserClick = () => {
        this.props.showTermsOfUseModal();
    };

    render() {
        return (
            <div className="NoUser">
                <Undertittel className="NoUser__title">
                    Du har ikke tatt i bruk innloggede tjenester
                </Undertittel>
                <Normaltekst className="NoUser__text">
                    For å kunne lagre søk og favoritter, må du opprette en bruker.
                </Normaltekst>
                <Hovedknapp
                    className="NoUser__button"
                    onClick={this.onCreateUserClick}
                >
                    Ny bruker
                </Hovedknapp>
                <Link to="/" className="lenke typo-normal">
                    Forsett uten bruker
                </Link>
            </div>
        );
    }
}

NoUser.propTypes = {
    showTermsOfUseModal: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showTermsOfUseModal: () => dispatch({ type: SHOW_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NoUser);

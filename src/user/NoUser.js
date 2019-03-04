import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/button/Button';
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
                    Du har ikke samtykket til å bruke tjenesten
                </Undertittel>
                <Normaltekst className="NoUser__text">
                    Du må samtykke for å kunne lagre søk og favoritter.
                </Normaltekst>
                <Button
                    type="primary"
                    className="NoUser__button"
                    onClick={this.onCreateUserClick}
                >
                    Se samtykke
                </Button>
                <Link to="/" className="lenke typo-normal">
                    Fortsett uten å samtykke
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

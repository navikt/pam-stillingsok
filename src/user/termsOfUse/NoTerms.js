import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Container } from 'nav-frontend-grid';
import { PrimaryButton } from '../../common/button';
import { FETCH_TERMS_OF_USE } from '../userReducer';

const NoTerms = ({ fetchTermsOfUse, isFetchingTermsOfUse }) => {
    return (
        <Container className="TermsOfUse__main">
            <Undertittel className="TermsOfUse__title">
                Kunne ikke hente samtykketekst.
            </Undertittel>
            <Normaltekst className="blokk-l">
                {'Kunne ikke hente samtykketekst. Prøv igjen senere.'}
            </Normaltekst>
            <PrimaryButton
                onClick={fetchTermsOfUse}
                spinner={isFetchingTermsOfUse}
                disabled={isFetchingTermsOfUse}
            >
                Hent samtykketekst
            </PrimaryButton>
        </Container>
    );
};

NoTerms.propTypes = {
    fetchTermsOfUse: PropTypes.func.isRequired,
    isFetchingTermsOfUse: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isFetchingTermsOfUse: state.user.isFetchingTermsOfUse
});

const mapDispatchToProps = (dispatch) => ({
    fetchTermsOfUse: () => dispatch({ type: FETCH_TERMS_OF_USE })
});

export default connect(mapStateToProps, mapDispatchToProps)(NoTerms);

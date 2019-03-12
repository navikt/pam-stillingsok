import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import { Container } from 'nav-frontend-grid';
import PageHeader from '../common/pageHeader/PageHeader';
import { FlatButton, PrimaryButton } from '../common/button';
import { CREATE_USER, FETCH_TERMS_OF_USE } from './userReducer';
import './TermsOfUse.less';

/* eslint-disable react/no-danger */

const TermsOfUse = withRouter(({
    createUser,
    history,
    isCreating,
    termsOfUse,
    fetchTermsOfUse
}) => {
    const [accepted, setAccepted] = useState(false);
    const onCheckboxClick = (event) => setAccepted(event.target.checked);
    const redirectToSearch = () => history.push('/stillinger');
    const onMainClick = () => {
        createUser();
        history.goBack();
    };

    useEffect(() => {
        fetchTermsOfUse();
    }, []);

    return (
        <div className="TermsOfUse">
            <PageHeader
                title="Samtykke"
                backUrl="/stillinger"
            />
            <Container className="TermsOfUse__main">
                <Undertittel className="TermsOfUse__title">
                    Ta i bruk innloggede tjenester
                </Undertittel>
                {termsOfUse && (
                    <div className="TermsOfUse__section" dangerouslySetInnerHTML={{ __html: termsOfUse.tekst }} />
                )}
                <div className="TermsOfUse__section blokk-l">
                    <Checkbox
                        name="terms"
                        label="Jeg samtykker til at Arbeidsplassen lagrer min CV og jobbprofil, mine favoritter og lagrede søk."
                        value="terms"
                        onChange={onCheckboxClick}
                        checked={accepted}
                    />
                </div>
                <div className="TermsOfUse__buttons blokk-l">
                    <PrimaryButton
                        onClick={onMainClick}
                        spinner={isCreating}
                        disabled={isCreating || !accepted}
                    >
                        Jeg samtykker
                    </PrimaryButton>
                    <FlatButton onClick={redirectToSearch}>
                        Avbryt
                    </FlatButton>
                </div>
            </Container>
        </div>
    );
});

TermsOfUse.propTypes = {
    createUser: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
    fetchTermsOfUse: PropTypes.func.isRequired,
    termsOfUse: PropTypes.shape({
        tekst: PropTypes.string,
        versjon: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    isCreating: state.user.isCreating,
    termsOfUse: state.user.termsOfUse
});

const mapDispatchToProps = (dispatch) => ({
    createUser: (email) => dispatch({ type: CREATE_USER, email }),
    fetchTermsOfUse: () => dispatch({ type: FETCH_TERMS_OF_USE })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);

import { Container } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, FlatButton, PrimaryButton } from '../../common/button/index';
import PageHeader from '../../common/pageHeader/PageHeader';
import DelayedSpinner from '../../search/loading/DelayedSpinner';
import { CREATE_USER, FETCH_TERMS_OF_USE, HIDE_FULL_TERMS_OF_USE, SHOW_FULL_TERMS_OF_USE } from '../userReducer';
import NoTerms from './NoTerms';
import './TermsOfUse.less';

/* eslint-disable react/no-danger */

const TermsOfUse = withRouter(({
    createUser,
    history,
    isCreating,
    termsOfUse,
    fetchTermsOfUse,
    isFetchingTermsOfUse,
    showFullTermsOfUse,
    hideFullTermsOfUse,
    isFullTermsOfUseVisible
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

    const failedFetchingTermsOfUse = !isFetchingTermsOfUse && !termsOfUse;

    if (isFetchingTermsOfUse) {
        return (
            <Container className="TermsOfUse__main">
                <div className="TermsOfUse__spinner">
                    <DelayedSpinner />
                </div>
            </Container>
        );
    }

    return (
        <div className="TermsOfUse">
            <PageHeader
                title="Samtykke"
                backUrl="/stillinger"
            />
            {failedFetchingTermsOfUse ? (
                <NoTerms />
            ) : (
                <Container className="TermsOfUse__main">
                    <Undertittel className="TermsOfUse__title">
                        Ta i bruk innloggede tjenester
                    </Undertittel>
                    <Normaltekst className="TermsOfUse__intro">
                        Du må samtykke for å bruke de innloggede tjenestene.
                    </Normaltekst>

                    <div className="TermsOfUse__section">
                        <BekreftCheckboksPanel
                            label="Ja, jeg samtykker"
                            checked={accepted}
                            onChange={onCheckboxClick}
                        >
                            <Element>
                                Dine favoritter, søk og søkekriterier
                            </Element>
                            <Normaltekst>
                                Vi lagrer dine favoritter og søk med søkekriterier.
                                Det er kun du som kan se hva du har lagret.
                            </Normaltekst>
                        </BekreftCheckboksPanel>
                    </div>

                    <div className="TermsOfUse__section">
                        <button className="TermsOfUse__link-button" onClick={showFullTermsOfUse}>
                            Se hele samtykke-teksten
                        </button>
                        <Normaltekst>
                            Du kan trekke samtykket hvis du ikke lenger ønsker å bruke innloggede tjenestene.
                            Dette kan du gjøre under innstillinger.
                        </Normaltekst>
                    </div>


                    <div className="TermsOfUse__buttons">
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
            )}
            {isFullTermsOfUseVisible && (
                <Modal
                    isOpen
                    onRequestClose={hideFullTermsOfUse}
                    contentLabel="Samtykke"
                    appElement={document.getElementById('app')}
                >
                    <div className="TermsOfUse__modal">
                        {termsOfUse && (
                            <div
                                className="TermsOfUse__modal__text"
                                dangerouslySetInnerHTML={{ __html: termsOfUse.tekst }}
                            />
                        )}

                        <Button
                            onClick={hideFullTermsOfUse}
                        >
                            Lukk
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
});

TermsOfUse.propTypes = {
    createUser: PropTypes.func.isRequired,
    showFullTermsOfUse: PropTypes.func.isRequired,
    hideFullTermsOfUse: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
    fetchTermsOfUse: PropTypes.func.isRequired,
    termsOfUse: PropTypes.shape({
        tekst: PropTypes.string,
        versjon: PropTypes.string
    }),
    isFetchingTermsOfUse: PropTypes.bool.isRequired,
    isFullTermsOfUseVisible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isCreating: state.user.isCreating,
    termsOfUse: state.user.termsOfUse,
    isFetchingTermsOfUse: state.user.isFetchingTermsOfUse,
    isFullTermsOfUseVisible: state.user.isFullTermsOfUseVisible
});

const mapDispatchToProps = (dispatch) => ({
    createUser: (email) => dispatch({ type: CREATE_USER, email }),
    showFullTermsOfUse: () => dispatch({ type: SHOW_FULL_TERMS_OF_USE }),
    hideFullTermsOfUse: () => dispatch({ type: HIDE_FULL_TERMS_OF_USE }),
    fetchTermsOfUse: () => dispatch({ type: FETCH_TERMS_OF_USE })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);

import AlertStripe from 'nav-frontend-alertstriper';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../common/pageHeader/PageHeader';
import Disclaimer from '../discalimer/Disclaimer';
import { CONTEXT_PATH } from '../fasitProperties';
import ConfirmDeleteUserModal from './ConfirmDeleteUserModal';
import NotAuthenticated from './NotAuthenticated';
import NoUser from './NoUser';
import { SET_USER_EMAIL, SHOW_CONFIRM_DELETE_USER_MODAL, UPDATE_USER } from './userReducer';
import './UserSettings.less';

const PAGE_TITLE = 'Min side';

class UserSettings extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = PAGE_TITLE;
    }

    onEmailChange = (e) => {
        this.props.setUserEmail(e.target.value);
    };

    onUpdateUserClick = () => {
        this.props.updateUser();
    };

    onDeleteUserClick = () => {
        this.props.showConfirmDeleteUserModal();
    };

    onRemoveEmailClick = () => {
        this.props.setUserEmail(null);
        this.props.updateUser();
    };

    render() {
        return (
            <div className="UserSettings">
                <Disclaimer />
                <PageHeader
                    backUrl="/"
                    title={PAGE_TITLE}
                />
                <Container>
                    {this.props.isAuthenticated === false ? (
                        <div className="UserSettings__main">
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å ta i bruk Min side" />
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {!this.props.user && (
                                <div className="UserSettings__main">
                                    <div className="UserSettings__section">
                                        <Row>
                                            <Column xs="12">
                                                <NoUser />
                                            </Column>
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {this.props.user && (
                                <div className="UserSettings__main">
                                    <div className="UserSettings__section">
                                        <Row>
                                            <Column xs="12">
                                                <Undertittel className="UserSettings__email-title">
                                                    E-postvarslinger
                                                </Undertittel>
                                                <Normaltekst className="UserSettings__email-text">
                                                    Hvis du gjør et søk og vil lagre søkekriteriene under Lagrede søk,
                                                    trenger vi en e-postadresse som du vil motta stillingsannonser på.
                                                    <br /><br />
                                                    Hvis du ikke ønsker å motta e-postvarslinger kan du
                                                    slette e-postadressen.
                                                </Normaltekst>
                                                <div className="UserSettings__email-input">
                                                    <Input
                                                        label="E-postadressen din"
                                                        value={this.props.user.email || ''}
                                                        onChange={this.onEmailChange}
                                                    />
                                                </div>
                                                <div className="UserSettings__email-buttons">
                                                    <Knapp
                                                        onClick={this.onUpdateUserClick}
                                                        spinner={this.props.isUpdating}
                                                        disabled={this.props.isUpdating}
                                                    >
                                                        Lagre
                                                    </Knapp>
                                                    {this.props.user.email !== null && (
                                                        <Flatknapp
                                                            onClick={this.onRemoveEmailClick}
                                                            spinner={this.props.isUpdating}
                                                            disabled={this.props.isUpdating}
                                                        >
                                                            Slett e-post
                                                        </Flatknapp>
                                                    )}
                                                </div>
                                            </Column>
                                        </Row>
                                    </div>
                                    <div className="UserSettings__section">
                                        <Row>
                                            <Column xs="12">
                                                <Undertittel className="TermsOfUse__title">
                                                    Din bruker
                                                </Undertittel>
                                                <Normaltekst className="TermsOfUse__text">
                                                    Du har samtykket til våre <Link to={`${CONTEXT_PATH}/vilkar`} className="lenke">vilkår
                                                    for å bruke innloggede tjenester.
                                                    </Link>
                                                    <br /><br />
                                                    Hvis du ikke lenger ønsker å bruke innloggede tjenester i
                                                    stillingssøket, kan du slette brukeren din.
                                                    Når du sletter brukeren trekker du samtykket ditt. Du sletter
                                                    også alle dine favoritter og lagrede søk. Har du valgt å motta
                                                    varslinger på e-post, så vil du ikke lenger motta disse.
                                                </Normaltekst>
                                                <Knapp
                                                    onClick={this.onDeleteUserClick}
                                                >
                                                    Slett bruker
                                                </Knapp>
                                            </Column>
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {this.props.confirmDeleteUserModalIsVisible && (
                                <ConfirmDeleteUserModal />
                            )}
                            {this.props.userAlertStripeIsVisible && (
                                <AlertStripe type="suksess" solid className="UserSettingsAlertStripe">
                                    E-postadressen din ble endret
                                </AlertStripe>
                            )}
                            {this.props.updateUserError && (
                                <AlertStripe type="advarsel" solid className="UserSettingsAlertStripe">
                                    Det oppsto en feil ved endring av dine innstillinger. Forsøk å laste siden på nytt
                                </AlertStripe>
                            )}
                        </div>
                    )}
                </Container>
            </div>
        );
    }
}

UserSettings.defaultProps = {
    user: undefined,
    updateUserError: undefined,
    isAuthenticated: undefined
};

UserSettings.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string
    }),
    isAuthenticated: PropTypes.bool,
    updateUserError: PropTypes.shape({}),
    setUserEmail: PropTypes.func.isRequired,
    showConfirmDeleteUserModal: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    confirmDeleteUserModalIsVisible: PropTypes.bool.isRequired,
    userAlertStripeIsVisible: PropTypes.bool.isRequired,
    isUpdating: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user,
    isUpdating: state.user.isUpdating,
    updateUserError: state.user.updateUserError,
    userAlertStripeIsVisible: state.user.userAlertStripeIsVisible,
    confirmDeleteUserModalIsVisible: state.user.confirmDeleteUserModalIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    setUserEmail: (email) => dispatch({ type: SET_USER_EMAIL, email }),
    updateUser: () => dispatch({ type: UPDATE_USER }),
    showConfirmDeleteUserModal: () => dispatch({ type: SHOW_CONFIRM_DELETE_USER_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);

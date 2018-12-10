import { Column, Container, Row } from 'nav-frontend-grid';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../common/pageHeader/PageHeader';
import { CONTEXT_PATH } from '../fasitProperties';
import ConfirmDeleteUserModal from './ConfirmDeleteUserModal';
import NotAuthenticated from '../authentication/NotAuthenticated';
import NoUser from './NoUser';
import { SHOW_CONFIRM_DELETE_USER_MODAL, UPDATE_USER_EMAIL } from './userReducer';
import './UserSettings.less';
import { authenticationEnum } from '../authentication/authenticationReducer';
import Email from '../common/email/Email';
import { SET_EMAIL, VALIDATE_EMAIL } from '../common/email/emailReducer';

const PAGE_TITLE = 'Innstillinger';

class UserSettings extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = PAGE_TITLE;
    }

    onUpdateUserEmailClick = () => {
        this.props.updateUserEmail();
    };

    onDeleteUserClick = () => {
        this.props.showConfirmDeleteUserModal();
    };

    onRemoveEmailClick = () => {
        this.props.setEmail(null);
        this.props.validateEmail();
        this.props.updateUserEmail();
    };

    render() {
        return (
            <div className="UserSettings">
                <PageHeader
                    backUrl="/"
                    title={PAGE_TITLE}
                />
                <Container>
                    {this.props.isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <div className="UserSettings__main">
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å se dine innstillinger" />
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    )}
                    {this.props.isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
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
                                                    Ønsker du å motta varslinger på et lagret søk trenger vi
                                                    e-postadressen din. Den vil bare bli brukt til dette formålet.
                                                    <br /><br />
                                                    Hvis du ikke ønsker å motta e-postvarsling kan du skru den
                                                    av under <Link to={`${CONTEXT_PATH}/lagrede-sok`} className="lenke">
                                                    lagrede søk
                                                    </Link> eller slette e-postadressen.
                                                </Normaltekst>
                                                <div className="UserSettings__email-input">
                                                    <Email
                                                        label="E-postadressen din (valgfritt)"
                                                    />
                                                </div>
                                                <div className="UserSettings__email-buttons">
                                                    <Knapp
                                                        onClick={this.onUpdateUserEmailClick}
                                                        spinner={this.props.isUpdating}
                                                        disabled={this.props.isUpdating}
                                                    >
                                                        Lagre
                                                    </Knapp>
                                                    {this.props.email && this.props.email.length > 0 && (
                                                        <Flatknapp
                                                            onClick={this.onRemoveEmailClick}
                                                            spinner={this.props.isUpdating}
                                                            disabled={this.props.isUpdating}
                                                        >
                                                            Slett
                                                        </Flatknapp>
                                                    )}
                                                </div>
                                            </Column>
                                        </Row>
                                    </div>
                                    <div className="UserSettings__section">
                                        <Row>
                                            <Column xs="12">
                                                <Undertittel className="UserSettings__user__title">
                                                    Samtykke
                                                </Undertittel>
                                                <div className="UserSettings__user__text">
                                                    <Normaltekst>
                                                        Du har samtykket til å bruke innloggede tjenester i stillingssøk.
                                                    </Normaltekst>
                                                    <br />
                                                    <Element>Vi lagrer:</Element>
                                                    <ul className="typo-normal UserSettings__user__text__list">
                                                        <li>dine favoritter</li>
                                                        <li>søk med søkekriterier</li>
                                                        <li>e-postadresse (valgfritt)</li>
                                                    </ul>
                                                    <Normaltekst>
                                                        Hvis du ikke lenger ønsker å bruke innloggede tjenester i
                                                        stillingssøket, kan du slette samtykke. Da sletter du også
                                                        alle dine favoritter og lagrede søk. Har du valgt å motta
                                                        varslinger på e-post, så vil du ikke lenger motta disse.
                                                    </Normaltekst>
                                                </div>
                                                <Knapp
                                                    onClick={this.onDeleteUserClick}
                                                >
                                                    Slett samtykke
                                                </Knapp>
                                            </Column>
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {this.props.confirmDeleteUserModalIsVisible && (
                                <ConfirmDeleteUserModal />
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
    email: undefined
};

UserSettings.propTypes = {
    user: PropTypes.shape({}),
    isAuthenticated: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    validateEmail: PropTypes.func.isRequired,
    showConfirmDeleteUserModal: PropTypes.func.isRequired,
    updateUserEmail: PropTypes.func.isRequired,
    confirmDeleteUserModalIsVisible: PropTypes.bool.isRequired,
    isUpdating: PropTypes.bool.isRequired,
    email: PropTypes.string
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated,
    user: state.user.user,
    isUpdating: state.user.isUpdating,
    updateUserError: state.user.updateUserError,
    confirmDeleteUserModalIsVisible: state.user.confirmDeleteUserModalIsVisible,
    validation: state.user.validation,
    email: state.email.email
});

const mapDispatchToProps = (dispatch) => ({
    setEmail: (value) => dispatch({ type: SET_EMAIL, value }),
    validateEmail: () => dispatch({ type: VALIDATE_EMAIL }),
    updateUserEmail: () => dispatch({ type: UPDATE_USER_EMAIL }),
    showConfirmDeleteUserModal: () => dispatch({ type: SHOW_CONFIRM_DELETE_USER_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);

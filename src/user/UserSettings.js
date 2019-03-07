import { Column, Container, Row } from 'nav-frontend-grid';
import { Input } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlatButton, Button } from '../common/button';
import PageHeader from '../common/pageHeader/PageHeader';
import { CONTEXT_PATH } from '../fasitProperties';
import ConfirmDeleteUserModal from './ConfirmDeleteUserModal';
import NotAuthenticated from '../authentication/NotAuthenticated';
import NoUser from './NoUser';
import { SET_USER_EMAIL, SHOW_CONFIRM_DELETE_USER_MODAL, UPDATE_USER_EMAIL, VALIDATE_USER_EMAIL } from './userReducer';
import './UserSettings.less';
import { authenticationEnum } from '../authentication/authenticationReducer';

const PAGE_TITLE = 'Innstillinger';

class UserSettings extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = PAGE_TITLE;
    }

    onEmailChange = (e) => {
        this.props.setUserEmail(e.target.value);
    };

    onEmailBlur = () => {
        this.props.validateEmail();
    };

    onUpdateUserEmailClick = () => {
        this.props.updateUserEmail();
    };

    onDeleteUserClick = () => {
        this.props.showConfirmDeleteUserModal();
    };

    onRemoveEmailClick = () => {
        this.props.setUserEmail(null);
        this.props.validateEmail();
        this.props.updateUserEmail();
    };

    render() {
        const { validation } = this.props;

        return (
            <div className="UserSettings">
                <PageHeader
                    backUrl={`${CONTEXT_PATH}/`}
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
                                                    <Input
                                                        label="E-postadressen din (valgfritt)"
                                                        value={this.props.user.email || ''}
                                                        onChange={this.onEmailChange}
                                                        onBlur={this.onEmailBlur}
                                                        feil={validation.email ? {
                                                            feilmelding: validation.email
                                                        } : undefined}
                                                    />
                                                </div>
                                                <div className="UserSettings__email-buttons">
                                                    <Button
                                                        onClick={this.onUpdateUserEmailClick}
                                                        spinner={this.props.isUpdating}
                                                        disabled={this.props.isUpdating}
                                                    >
                                                        Lagre
                                                    </Button>
                                                    {this.props.user.email !== null && (
                                                        <FlatButton
                                                            onClick={this.onRemoveEmailClick}
                                                            spinner={this.props.isUpdating}
                                                            disabled={this.props.isUpdating}
                                                        >
                                                            Slett
                                                        </FlatButton>
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
                                                <Button
                                                    onClick={this.onDeleteUserClick}
                                                >
                                                    Slett samtykke
                                                </Button>
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
    user: undefined
};

UserSettings.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string
    }),
    isAuthenticated: PropTypes.string.isRequired,
    setUserEmail: PropTypes.func.isRequired,
    validateEmail: PropTypes.func.isRequired,
    showConfirmDeleteUserModal: PropTypes.func.isRequired,
    updateUserEmail: PropTypes.func.isRequired,
    confirmDeleteUserModalIsVisible: PropTypes.bool.isRequired,
    isUpdating: PropTypes.bool.isRequired,
    validation: PropTypes.shape({
        email: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated,
    user: state.user.user,
    isUpdating: state.user.isUpdating,
    updateUserError: state.user.updateUserError,
    confirmDeleteUserModalIsVisible: state.user.confirmDeleteUserModalIsVisible,
    validation: state.user.validation
});

const mapDispatchToProps = (dispatch) => ({
    setUserEmail: (email) => dispatch({ type: SET_USER_EMAIL, email }),
    validateEmail: () => dispatch({ type: VALIDATE_USER_EMAIL }),
    updateUserEmail: () => dispatch({ type: UPDATE_USER_EMAIL }),
    showConfirmDeleteUserModal: () => dispatch({ type: SHOW_CONFIRM_DELETE_USER_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);

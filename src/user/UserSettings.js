import { Column, Container, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../common/pageHeader/PageHeader';
import Disclaimer from '../discalimer/Disclaimer';
import { SET_USER_EMAIL, UPDATE_USER } from './userReducer';
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

    render() {
        return (
            <div className="UserSettings">
                <Disclaimer />
                <PageHeader
                    backUrl="/"
                    title={PAGE_TITLE}
                />
                <Container>
                    {this.props.user && (
                        <div className="UserSettings__main">
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <Undertittel className="UserSettings__email-title">
                                            Endre e-postadresse
                                        </Undertittel>
                                        <Normaltekst className="UserSettings__email-text">
                                            Hvis du gjør et søk og vil lagre søkekriteriene under Lagrede søk,
                                            trenger vi en e-postadresse som du vil motta stillingsannonser på.
                                        </Normaltekst>
                                        <div className="UserSettings__email-input">
                                            <Input
                                                label="E-postadressen din"
                                                value={this.props.user.email || ''}
                                                onChange={this.onEmailChange}
                                            />
                                        </div>
                                        <Knapp
                                            onClick={this.onUpdateUserClick}
                                            spinner={this.props.isUpdating}
                                            disabled={this.props.isUpdating}
                                        >
                                        Lagre
                                        </Knapp>
                                    </Column>
                                </Row>
                            </div>
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <Undertittel className="TermsOfUse__title">
                                           Slett konto
                                        </Undertittel>
                                        <Normaltekst className="TermsOfUse__text">
                                            Du har akseptert våre <Link to="/vilkar" className="lenke">vilkår for å
                                            bruke innloggede tjenester
                                            </Link> og du kan trekke samtykket ditt når som
                                            helst hvis du ikke lenger ønsker å bruke innloggede tjenester i stillingssøket.
                                        </Normaltekst>
                                        <Knapp
                                            onClick={this.onUpdateUserClick}
                                        >
                                            Slett konto
                                        </Knapp>
                                    </Column>
                                </Row>
                            </div>
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
    setUserEmail: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    isUpdating: state.user.isUpdating
});

const mapDispatchToProps = (dispatch) => ({
    setUserEmail: (email) => dispatch({ type: SET_USER_EMAIL, email }),
    updateUser: () => dispatch({ type: UPDATE_USER })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
